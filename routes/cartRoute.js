const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  addProductToCart,
  getProductsFromCart,
  removeProductFromCart,
  removeCart,
  applyCouponAtCart,
  updateProductQuantity,
} = require("../services/cartService");

const router = express.Router();
router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getProductsFromCart)
  .delete(removeCart);

router.route("/applyCoupon").put(applyCouponAtCart);

router
  .route("/:itemId")
  .delete(removeProductFromCart)
  .put(updateProductQuantity);

module.exports = router;
