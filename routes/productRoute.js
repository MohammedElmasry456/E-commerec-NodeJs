const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} = require("../services/productService");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidtator");
const reviewRoute = require("./reviewRoute");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    createProduct
  )
  .get(getAllProducts);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
