import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface student extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobile: number;
    password: string;
    image: string;
    purchased_course: ObjectId[];
    token: string;
    access: boolean;
}

const studentSchema = new Schema<student>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    purchased_course: {
        type: [ObjectId],
        ref:"Course",
        required: false,
      },
    token: {
        type: String
    },
    access: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<student>("Student", studentSchema);
