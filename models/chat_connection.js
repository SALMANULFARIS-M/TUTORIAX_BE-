"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    connection: {
        type: [mongodb_1.ObjectId],
        required: true,
    },
    last_message: {
        type: mongodb_1.ObjectId,
        required: false,
    },
}, {
    timestamps: true, // Add timestamps fields
});
exports.default = (0, mongoose_1.model)("Chat_Connection", connectionSchema);
