const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

// @desc add to wishlist
// @route POST /api/v1/wishlist
// @access protected/user
exports.addAddressToUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "Address Addeded Successfully",
    data: user.addresses,
  });
});

// @desc delete address from user
// @route DELETE /api/v1/wishlist/:addressId
// @access protected/user
exports.removeAddressFromUser = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).send({
    status: "success",
    message: "address Removed Successfully",
    data: user.addresses,
  });
});

// @desc get addresses
// @route GET /api/v1/address
// @access protected/user
exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("addresses");
  res.status(200).send({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
