const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "product title Required"],
      minlength: [3, "Too Short product Title"],
      maxlength: [100, "Too Long product Title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "product Description Required"],
      minlength: [20, "Too Short product Description"],
    },
    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    colors: [String],
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// const setUrl = (doc) => {
//   if (doc.imageCover) {
//     const url = `${process.env.BASE_URL}/products/${doc.imageCover}`;
//     doc.imageCover = url;
//   }
//   if (doc.images) {
//     const imagesList = [];
//     doc.images.map((image) => {
//       const url = `${process.env.BASE_URL}/products/${image}`;
//       imagesList.push(url);
//     });
//     doc.images = imagesList;
//   }
// };

//populate Reviews
productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

// //for all but not create
// productSchema.post("init", (doc) => {
//   setUrl(doc);
// });
// //for create
// productSchema.post("save", (doc) => {
//   setUrl(doc);
// });

//Mongoose Query Middleware
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
