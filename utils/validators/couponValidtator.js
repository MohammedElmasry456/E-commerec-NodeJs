const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const couponModel = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name required")
    .toUpperCase()
    .custom((val) =>
      couponModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Coupon is Already Exist"));
        }
      })
    ),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  check("name")
    .optional()
    .toUpperCase()
    .custom((val) =>
      couponModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Coupon is Already Exist"));
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id Format"),
  validatorMiddleware,
];
