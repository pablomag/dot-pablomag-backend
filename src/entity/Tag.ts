import Joi from "joi";
import mongoose from "mongoose";

interface ITag {
    name: string;
}

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true,
    },
});

export async function validate(newTag: ITag) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(20).required(),
    });

    return await schema.validateAsync(newTag);
}

export const Tag = mongoose.model("tag", tagSchema);
