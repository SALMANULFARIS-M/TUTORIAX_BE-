import { ObjectId } from "mongodb";
import { Schema, Document, model } from "mongoose";

interface order extends Document {
    payment_id: string;
    course_id: ObjectId;
    student_id: ObjectId;
    amount: number;
}

const orderSchema = new Schema<order>({
    payment_id: {
        type: String,
        required: true,
    },
    course_id: {
        type: ObjectId,
        required: true,
        ref: "Course"
    },
    student_id: {
        type: ObjectId,
        required: true,
        ref: "Student"
    },
    amount: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true, // Add timestamps fields
});

export default model<order>("Order", orderSchema);
