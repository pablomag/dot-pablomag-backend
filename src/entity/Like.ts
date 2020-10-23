import Joi from "joi";
import mongoose from "mongoose";

interface ILike {
    post: string;
    ip: string;
}

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    ip: {
        type: String,
        minlength: 7,
        maxlength: 15,
        required: true,
    },
});

export async function validate(newLike: ILike) {
    const schema = Joi.object().keys({
        post: Joi.optional(),
        ip: Joi.string().min(3).max(20).required(),
    });

    if (!mongoose.Types.ObjectId.isValid(newLike.post))
        return {
            error: {
                isJoi: true,
                name: "ValidationError",
                details: [{ message: "Validation error: Invalid author" }],
            },
        };

    return await schema.validateAsync(newLike);
}

export const Like = mongoose.model("like", likeSchema);
