const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/productModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

const { uploadMixImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImage = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const coverName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${coverName}`);

    req.body.imageCover = coverName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(image.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);

        req.body.images.push(filename);
      })
    );
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
