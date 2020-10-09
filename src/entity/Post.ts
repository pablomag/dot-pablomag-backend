import Joi from "@hapi/joi";
import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

interface IPost {
    title: string;
    image: string;
    content: string;
    author: string;
    tags: Array<[]>;
    likes: number;
    comments: number;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 10,
        maxlength: 120,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tags: {
        type: Array,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});

export async function validate(newPost: IPost) {
    const schema = Joi.object().keys({
        title: Joi.string().min(10).max(120).required(),
        image: Joi.string().min(10).max(120).required(),
        content: Joi.string().required(),
        author: Joi.optional(),
        tags: Joi.array().items(Joi.string().min(3).max(20)).unique(),
        likes: Joi.number().integer().min(0).max(1000000).optional(),
        comments: Joi.number().integer().min(0).max(1000000).optional(),
    });

    if (!mongoose.Types.ObjectId.isValid(newPost.author))
        return {
            error: {
                isJoi: true,
                name: "ValidationError",
                details: [{ message: "Validation error: Invalid author" }],
            },
        };

    return await schema.validateAsync(newPost);
}

export const Post = mongoose.model("Post", postSchema);
