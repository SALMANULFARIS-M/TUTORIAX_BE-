"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    payment_id: {
        type: String,
        required: true,
    },
    course_id: {
        type: mongodb_1.ObjectId,
        required: true,
        ref: "Course"
    },
    student_id: {
        type: mongodb_1.ObjectId,
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
exports.default = (0, mongoose_1.model)("Order", orderSchema);
