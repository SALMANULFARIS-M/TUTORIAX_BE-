"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const reference = ['Student', 'Teacher'];
const connectionSchema = new mongoose_1.Schema({
    connetion_id: {
        type: mongodb_1.ObjectId,
        ref: 'Chat_Connection',
        required: true,
    },
    from: {
        type: mongodb_1.ObjectId,
        ref: "Student" || "Teacher",
        required: true,
    },
    to: {
        type: mongodb_1.ObjectId,
        ref: "Student" || "Teacher",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Chat_Content", connectionSchema);
