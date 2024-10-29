const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name Required"],
      unique: [true, "coupon name Must Be Unique"],
    },
    expire: {
      type: Date,
      required: [true, "expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "discount vale is required"],
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;
