const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Disk Storage Method
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
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
