const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

const { multerOptions } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImage = multerOptions(300, 300, "uploads/products").fields(
  [
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]
);

exports.setProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    req.body.imageCover = req.files.imageCover[0].path;
  }
  if (req.files.images) {
    req.body.images = [];
    req.files.images.map((image) => {
      req.body.images.push(image.path);
    });
  }
  next();
});

// @desc create product
// @route POST /api/v1/products
// @access private
exports.createProduct = createOne(productModel);

// @desc get list of products
// @route GET /api/v1/products
// @access puplic
exports.getAllProducts = getAll(productModel, "products");

// @desc get specific product by id
// @route GET /api/v1/products/:id
// @access puplic
exports.getProduct = getOne(productModel, "reviews");

// @desc update specific product
// @route PUT /api/v1/products/:id
// @access private
exports.updateProduct = updateOne(productModel);

// @desc delete specific product
// @route DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = deleteOne(productModel);
