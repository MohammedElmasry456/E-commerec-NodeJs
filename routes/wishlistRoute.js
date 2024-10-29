const express = require("express");
const { protect, allowedTo } = require("../services/authService");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getProductsFromWishlist,
} = require("../services/wishlistService");

const router = express.Router();
router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getProductsFromWishlist);
router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;
