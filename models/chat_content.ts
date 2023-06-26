import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface connection extends Document {
    connetion_id:ObjectId;
    from: ObjectId;
    to: ObjectId;
    content: string;
}

const connectionSchema = new Schema<connection>({
    connetion_id: {
        type: ObjectId,
        ref: 'Chat_Connection',
        required: true,
    },
    from: {
        type: ObjectId,
        ref: 'Student',
        required: true,
    },
    to: {
        type: ObjectId,
        ref: 'Teacher',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<connection>("Chat_Content", connectionSchema);
