const asyncHandler = require("express-async-handler");
const { multerOptions } = require("../middlewares/uploadImageMiddleware");
const brandModel = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

exports.uploadBrandImage = multerOptions(400, 400, "uploads/brands").single(
  "image"
);

exports.setBrandImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path;
  }
  next();
});

// @desc create brand
// @route POST /api/v1/brands
// @access private
exports.createBrand = createOne(brandModel);

// @desc get list of brands
// @route GET /api/v1/brands
// @access puplic
exports.getAllBrands = getAll(brandModel);

// @desc get specific brand by id
// @route GET /api/v1/brands/:id
// @access puplic
exports.getBrand = getOne(brandModel);

// @desc update specific brand
// @route PUT /api/v1/brands/:id
// @access private
exports.updateBrand = updateOne(brandModel);

// @desc delete specific brand
// @route DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = deleteOne(brandModel);
