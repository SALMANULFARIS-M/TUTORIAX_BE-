"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    connection: {
        student: { type: mongodb_1.ObjectId, ref: 'Student', required: true },
        teacher: { type: mongodb_1.ObjectId, ref: 'Teacher', required: true },
    },
    last_message: {
        type: mongodb_1.ObjectId,
        ref: 'Chat_Content',
        default: null,
        required: false,
    },
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Chat_Connection", connectionSchema);
