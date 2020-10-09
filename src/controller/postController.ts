import { Request, Response, Router } from "express";

import bodyParser from "../middleware/bodyParser";

import { Post } from "../entity/Post";
import { User } from "../entity/User";

import { validateObjectId } from "../util/validation";

const router = Router();

router.get("/create", async (req: Request, res: Response) => {
    const user = req.session!.user[0];
    const author = await User.findOne({ userid: user.userid }, "_id name");

    const validationError = validateObjectId(author!._id);
    if (validationError) {
        return res.render("index.hbs");
    }

    try {
        const title = "CREATE NEW POST";

        return res.render("post/create.hbs", { title: title });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/edit/:slug", [bodyParser], async (req: Request, res: Response) => {
    const user = req.session!.user[0];
    const author = await User.findOne({ userid: user.userid }, "_id name");

    const validationError = validateObjectId(author!._id);
    if (validationError) {
        return res.render("index.hbs");
    }

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    try {
        const title = `EDIT POST: ${req.params.slug}`;

        return res.render("post/edit.hbs", { title: title });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/list", async (_, res: Response) => {
    try {
        const posts = await Post.find()
            .populate("author", "name picture -_id")
            .select("_id createdAt slug title image author")
            .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(200).json({ error: "No posts found" });
        }

        return res.render("post/list.hbs", {
            posts: posts.map((post) => post.toJSON()),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;
