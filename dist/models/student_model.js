"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
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
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    purchased_course: {
        type: [mongodb_1.ObjectId],
        ref: "Course",
        required: false,
    },
    token: {
        type: String
    },
    access: {
        type: Boolean,
        default: true
    },
    couponsApplied: {
        type: [mongodb_1.ObjectId],
        required: false,
    },
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Student", studentSchema);
