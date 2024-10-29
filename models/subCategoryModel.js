const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "Category Must Be Unique"],
      minlength: [2, "Too Short subCategory Name"],
      maxlength: [32, "Too Long subCategory Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Subcategory must be belong to category"],
    },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = mongoose.model("subcategory", subCategorySchema);
module.exports = subCategoryModel;
