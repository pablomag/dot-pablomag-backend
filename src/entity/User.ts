import Joi from "@hapi/joi";
import mongoose from "mongoose";

interface IUser {
    title: string;
    name: string;
    email: string;
    picture: string;
    isAdmin: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        minlength: 5,
        maxlength: 255,
        trim: true,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        minlength: 12,
        maxlength: 120,
        trim: true,
        unique: true,
        required: true,
    },
    picture: {
        type: String,
        default: "no-avatar.png",
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
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

export async function validate(newUser: IUser) {
    const schema = Joi.object().keys({
        userid: Joi.string().min(5).max(255).required(),
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().min(12).max(120).required(),
        picture: Joi.string().min(5).max(255).optional(),
        isAdmin: Joi.boolean().optional(),
    });

    return await schema.validateAsync(newUser);
}

export const User = mongoose.model("User", userSchema);
