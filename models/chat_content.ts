import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface connection extends Document {
    connetion_id: ObjectId;
    from: ObjectId;
    to: ObjectId;
    text: string;
}
const reference = ['Student', 'Teacher'] as const;
const connectionSchema = new Schema<connection>({
    connetion_id: {
        type: ObjectId,
        ref: 'Chat_Connection',
        required: true,
    },
    from: {
        type: ObjectId,
        ref: "Student" || "Teacher",
        required: true,
    },
    to: {
        type: ObjectId,
        ref: "Student" || "Teacher",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<connection>("Chat_Content", connectionSchema);
