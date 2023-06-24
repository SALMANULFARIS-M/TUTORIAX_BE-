import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface teacher extends Document {
    fullName: string;
    email: string;
    mobile: number;
    password: string;
    image: string;
    certificate: string;
    token: string;
    approval: boolean;
    access: boolean;
}

const teacherSchema = new Schema<teacher>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    mobile: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    certificate: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    approval: {
        type: Boolean,
        default: false
    },
    access: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<teacher>("Teacher", teacherSchema);
