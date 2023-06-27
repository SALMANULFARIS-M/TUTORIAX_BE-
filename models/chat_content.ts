import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface connection extends Document {
    connection_id: ObjectId;
    from: ObjectId;
    to: ObjectId;
    text: string|null;
}
const connectionSchema = new Schema<connection>({
    connection_id: {
        type: ObjectId,
        ref: 'Chat_Connection',
        required: true,
    },
    from: {
        type: ObjectId,
        required: true,
    },
    to: {
        type: ObjectId,
        required: true,
    },
    text: {
        type: String,
        default:"",
        required: true,
    }
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<connection>("Chat_Content", connectionSchema);
