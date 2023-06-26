import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface connection extends Document {
    connection: { student: ObjectId; teacher: ObjectId };
    last_message: ObjectId | null;
}

const connectionSchema = new Schema<connection>({
   connection: {
        student: { type: ObjectId, ref: 'Student', required: true },
        teacher: { type: ObjectId, ref: 'Teacher', required: true },
    },
    last_message: {
        type: ObjectId,
        required: false,
    },
},
    {
        timestamps: true, // Add timestamps fields
    });

export default model<connection>("Chat_Connection", connectionSchema);
