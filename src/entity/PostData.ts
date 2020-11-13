import Joi from "joi";
import mongoose from "mongoose";

interface IPostData {
    post: string;
    type: string;
    value: string;
    order: number;
}

const postDataSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
});

export async function validate(newPostData: IPostData) {
    const schema = Joi.object().keys({
        author: Joi.optional(),
        type: Joi.string().min(1).required(),
        value: Joi.string().min(1).required(),
        order: Joi.number().min(0).required(),
    });

    if (!mongoose.Types.ObjectId.isValid(newPostData.post)) {
        return {
            error: {
                isJoi: true,
                name: "ValidationError",
                details: [{ message: "Validation error: Invalid post" }],
            },
        };
    }

    return await schema.validateAsync(newPostData);
}

export const PostData = mongoose.model("PostData", postDataSchema);
