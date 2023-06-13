import { Schema, Document, model } from "mongoose";

interface course extends Document {
    title: string;
    author: string;
    date: Date;
    price: number;
    image_id: string;
    video_id: string;
    description: string;
}

const courseSchema = new Schema<course>({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image_id: {
        type: String,
        required: true,
    },
    video_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true
    }
});

export default model<course>("Course", courseSchema);
