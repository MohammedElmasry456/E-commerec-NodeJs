const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");
const { multerOptions } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryImage = multerOptions(
  400,
  400,
  "uploads/categories"
).single("image");

exports.setCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  next();
});

// @desc create cateory
// @route POST /api/v1/categories
// @access private
exports.createCategory = createOne(CategoryModel);

// @desc get list of cateories
// @route GET /api/v1/categories
// @access puplic
exports.getAllCategories = getAll(CategoryModel);

// @desc get specific cateoriy by id
// @route GET /api/v1/categories/:id
// @access puplic
exports.getCategory = getOne(CategoryModel);

// @desc update specific cateoriy
// @route PUT /api/v1/categories/:id
// @access private
exports.updateCategory = updateOne(CategoryModel);

// @desc delete specific cateoriy
// @route DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = deleteOne(CategoryModel);
