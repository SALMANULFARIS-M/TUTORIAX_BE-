"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    maxDiscount: {
        type: Number,
        required: true,
    },
    minAmount: {
        type: Number,
        required: true,
    },
    expDate: {
        type: Date,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("Coupon", couponSchema);
