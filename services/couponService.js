const couponModel = require("../models/couponModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

// @desc create Coupon
// @route POST /api/v1/couponss
// @access private/Admin-Manager
exports.createCoupon = createOne(couponModel);

// @desc get list of coupons
// @route GET /api/v1/coupons
// @access private/Admin-Manager
exports.getAllCoupons = getAll(couponModel);

// @desc get specific Coupon by id
// @route GET /api/v1/Coupons/:id
// @access private/Admin-Manager
exports.getCoupon = getOne(couponModel);

// @desc update specific Coupon
// @route PUT /api/v1/coupons/:id
// @access private/Admin-Manager
exports.updateCoupon = updateOne(couponModel);

// @desc delete specific Coupon
// @route DELETE /api/v1/coupons/:id
// @access private/Admin-Manager
exports.deleteCoupon = deleteOne(couponModel);
