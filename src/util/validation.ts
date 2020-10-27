import mongoose from "mongoose";
import { ValidationError } from "joi";

export function validateObjectId(objectId: string): ValidationError | null {
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return {
            isJoi: true,
            name: "ValidationError",
            details: [
                {
                    message: "Validation error: Invalid ObjectId provided",
                    path: [""],
                    type: "error",
                },
            ],
            message: "",
            annotate: (): string => {
                return "true";
            },
            _original: []
        };
    }
    return null;
}
