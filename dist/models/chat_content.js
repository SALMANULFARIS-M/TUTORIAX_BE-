"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    connection_id: {
        type: mongodb_1.ObjectId,
        ref: 'Chat_Connection',
        required: true,
    },
    from: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    to: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    text: {
        type: String,
        default: "",
        required: true,
    },
    view: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Chat_Content", connectionSchema);
