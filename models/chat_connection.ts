import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface connection extends Document {
    connection: ObjectId[];
    last_message:ObjectId;
}

const connectionSchema = new Schema<connection>({
    connection: {
        type: [ObjectId],
        required: true,
    },
    last_message:{
        type: ObjectId,
        required: false,
    },
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<connection>("Chat_Connection", connectionSchema);
