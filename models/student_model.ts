import { Schema, Document, model } from "mongoose";

interface student extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobile: number;
    password: string;
    image: string;
    token:string;
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
    token:{
        type:String
    }
});

export default model<student>("Student", studentSchema);
