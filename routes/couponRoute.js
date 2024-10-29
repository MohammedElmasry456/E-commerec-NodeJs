const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
const {
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
  getCouponValidator,
} = require("../utils/validators/couponValidtator");

const router = express.Router();
router.use(protect, allowedTo("admin", "manager"));

router.route("/").post(createCouponValidator, createCoupon).get(getAllCoupons);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
