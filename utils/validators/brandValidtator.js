const { check } = require("express-validator");
const slugify = require("slugify");

const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const brandModel = require("../../models/brandModel");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name required")
    .isLength({ min: 3 })
    .withMessage("Too Short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom((val) =>
      brandModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Brand Name Already Exist"));
        }
      })
    ),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom((val) =>
      brandModel.findOne({ name: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Brand Name Already Exist"));
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];
