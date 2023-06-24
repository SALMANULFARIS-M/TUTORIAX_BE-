"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
    fullName: {
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
    certificate: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    approval: {
        type: Boolean,
        default: false
    },
    access: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Teacher", teacherSchema);
