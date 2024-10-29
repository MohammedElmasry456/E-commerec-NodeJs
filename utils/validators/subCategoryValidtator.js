const { check } = require("express-validator");
const slugify = require("slugify");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");

exports.createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too Short subCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Long subCategory Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category Id required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

exports.getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

exports.updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
