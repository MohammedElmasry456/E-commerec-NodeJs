const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDis: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title imageCover price",
  });
  next();
});

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
