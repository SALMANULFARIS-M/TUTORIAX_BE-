import { Schema, Document, model } from "mongoose";

interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minAmount: number;
  expDate: Date;
}

const couponSchema: Schema<ICoupon> = new Schema({
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

export default model<ICoupon>("Coupon", couponSchema);
