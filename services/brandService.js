const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const brandModel = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    req.body.image = filename;
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
