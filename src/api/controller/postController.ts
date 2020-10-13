import { Request, Response, Router } from "express";

import mongoose, { ClientSession } from "mongoose";

import bodyParser from "../../middleware/bodyParser";

import { Post } from "../../entity/Post";
import { PostData } from "../../entity/PostData";
import { User } from "../../entity/User";
import { Tag } from "../../entity/Tag";
import { Like } from "../../entity/Like";

import { validateObjectId } from "../../util/validation";

const router = Router();

router.get(
    "/list",
    async (_: Request, res: Response): Promise<any> => {
        try {
            const posts = await Post.find({})
                .populate("author", "name picture -_id")
                .sort({ createdAt: -1 });
            if (posts.length === 0) {
                return res.status(404).json({ status: "error", message: "No posts found" });
            }

            return res.status(200).json({ status: "success", posts });
        } catch (error) {
            return res.status(500).json({ status: "success", message: error.message });
        }
    }
);

router.get(
    "/slug/:slug",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const post = await Post.findOne({ slug: req.params.slug }).populate(
                "author",
                "name picture -_id"
            );
            if (!post) {
                return res.status(404).json({ status: "error", message: "Post not found" });
            }

            const postData = await PostData.find({ post });
            if (!postData) {
                return res.status(400).json({ status: "error", message: "No post data found" });
            }

            const ip = req.ip;
            const liked = await Like.findOne({ post, ip });

            const postResponse = {
                post,
                data: postData,
                liked: !!liked
            };

            return res.status(200).json({ status: "success", post: postResponse });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
);

router.get(
    "/:id",
    async (req: Request, res: Response): Promise<any> => {
        const validationError = validateObjectId(req.params.id);
        if (validationError) {
            return res
                .status(400)
                .json({ status: "error", message: validationError.details[0].message });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(200).json({ status: "error", message: "Post not found" });
            }

            return res.status(200).json({ status: "success", post });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
);

router.post(
    "/edit/:slug",
    [bodyParser],
    async (req: Request, res: Response): Promise<any> => {
        const { title, image, content, fakeDOM } = req.body;

        const user = req.session!.user[0];
        const author = await User.findOne({ userid: user.userid }, "_id name");
        if (!author) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const validationError = validateObjectId(author!._id);
        if (validationError) {
            return res
                .status(400)
                .send({ status: "error", message: validationError.details[0].message });
        }

        const tags = [...new Set(req.body.tags)];
        for (let tag of tags) {
            const exists = await Tag.findOne({ name: tag }, "_id name");
            if (!exists) {
                const newTag = new Tag({ name: tag });
                newTag.save((error: any) => {
                    if (error) {
                        return console.error(error.message);
                    }
                });
            }
        }

        const slug = req.params.slug;

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            const updatedPost = {
                title,
                image,
                content,
                author,
                tags,
            };

            const post = await Post.findOneAndUpdate({ slug }, updatedPost, {
                session,
            });

            await PostData.deleteMany({ post }, { session });

            await Promise.all(
                fakeDOM._data.map(async (item: any) => {
                    const postData = new PostData({
                        post: post!._id,
                        type: item.type,
                        value: item.value,
                    });

                    return await postData.save({ session });
                })
            );

            await session.commitTransaction();

            return res.status(200).json({ status: "success", post });
        } catch (error) {
            await session.abortTransaction();

            return res.status(500).json({ status: "error", message: error.message });
        } finally {
            session.endSession();
        }
    }
);

router.post(
    "/save",
    [bodyParser],
    async (req: Request, res: Response): Promise<any> => {
        const { title, image, content, fakeDOM } = req.body;

        const user = req.session!.user[0];
        const author = await User.findOne({ userid: user.userid }, "_id name");
        if (!author) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const validationError = validateObjectId(author!._id);
        if (validationError) {
            return res
                .status(400)
                .send({ status: "error", message: validationError.details[0].message });
        }

        const tags = [...new Set(req.body.tags)];
        for (let tag of tags) {
            const exists = await Tag.findOne({ name: tag }, "_id name");
            if (!exists) {
                const newTag = new Tag({ name: tag });
                newTag.save((error) => {
                    if (error) {
                        return console.error(error);
                    }
                });
            }
        }

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            const post = new Post({
                title,
                image,
                content,
                author,
                tags,
            });

            await post.save({ session });

            await Promise.all(
                fakeDOM._data.map(async (item: any) => {
                    const postData = new PostData({
                        post: post._id,
                        type: item.type,
                        value: item.value,
                    });

                    return await postData.save({ session });
                })
            );

            await session.commitTransaction();

            return res.status(200).json({ status: "success", post });
        } catch (error) {
            await session.abortTransaction();

            return res.status(500).json({ status: "error", message: error.message });
        } finally {
            session.endSession();
        }
    }
);

router.delete(
    "/delete/:id",
    async (req: Request, res: Response): Promise<any> => {
        const id = req.params.id;

        const validationError = validateObjectId(id);
        if (validationError) {
            return res.status(400).send({ status: "error", message: validationError.details[0].message });
        }

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            const post: any = await Post.findByIdAndDelete(id);
            if (!post) {
                return res
                    .status(200)
                    .json({ status: "error", message: "Post not found" });
            }

            const postData: any = await PostData.deleteMany({ post: id });
            if (!postData) {
                return res.status(400).json({status: "error", message: "Post data not found" });
            }

            await session.commitTransaction();

            return res.status(200).json({ status: "success", message: "Post deleted" });
        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({
                status: "error",
                message: "An error has occurred while deleting the post",
            });
        } finally {
            session.endSession();
        }
    }
);

router.post(
    "/like/:id",
    [bodyParser],
    async (req: Request, res: Response): Promise<any> => {
        const { ip } = req.body;

        const post: any = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ status: "error", message: "Post not found" });
        }
        post.likes++;

        const liked = await Like.findOne({ post, ip });
        if (liked) {
            return res.status(200).json({ status: "error", message: "Post already liked" });
        }

        const like = new Like({
            post,
            ip,
        });

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            like.save((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });
            post.save((error: any) => {
                if (error) {
                    return console.error(error);
                }
            });

            await session.commitTransaction();

            res.status(200).json({ status: "success", message: "Post liked" });
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ status: "error", message: "Error while liking the post" });
        } finally {
            session.endSession();
        }
    }
);
/*
router.put("/comment-count-update/", [bodyParser], async (req, res) => {
    const { postId, commentCount } = req.body;

    const post = await Post.findById(postId);

    if (!post) return;

    post.comments = commentCount;

    try {
        post.save((err) => {
            if (err) return console.error(err);
        });

        console.log("comment count updated");
    } catch (err) {
        console.log("error while updating the comment count");
    }

    console.log(
        `Comment count for post ${post.slug} updated to ${post.comments}`
    );
});
*/
export default router;
