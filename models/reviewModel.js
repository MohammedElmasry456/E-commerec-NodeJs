const mongoose = require("mongoose");
const productModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Review Rating Is Required"],
      min: [1, "Min Rating is 1.0"],
      max: [5, "Max Rating is 5.0"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Review Must Belong To User"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: [true, "Review Must Belong To Product"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAvgAndQuantity = async function (productId) {
  const results = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (results.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingAverage: results[0].ratingAverage,
      ratingsQuantity: results[0].ratingsQuantity,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgAndQuantity(this.product);
});

const reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
