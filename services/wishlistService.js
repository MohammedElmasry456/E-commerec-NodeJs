const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

// @desc add to wishlist
// @route POST /api/v1/wishlist
// @access protected/user
exports.addProductToWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "product Added To Wishlist Successfully",
    data: user.wishlist,
  });
});

// @desc delete from wishlist
// @route DELETE /api/v1/wishlist/:productId
// @access protected/user
exports.removeProductFromWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "product Removed From Wishlist Successfully",
    data: user.wishlist,
  });
});

// @desc get products from wishlist
// @route GET /api/v1/wishlist
// @access protected/user
exports.getProductsFromWishlist = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");
  res.status(200).send({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
