import { Schema, Document, model } from "mongoose";

interface admin extends Document {
    email: string;
    password: string;
    token:string;
}

const adminSchema = new Schema<admin>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type:String
    }
});

export default model<admin>("Admin", adminSchema);