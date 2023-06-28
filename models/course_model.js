"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image_id: {
        type: String,
        required: true,
    },
    video_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    report: [{
            text: {
                type: String,
                required: true,
            },
            student: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
            },
        }]
});
exports.default = (0, mongoose_1.model)("Course", courseSchema);
