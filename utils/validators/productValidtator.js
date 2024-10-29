const { check } = require("express-validator");
const slugify = require("slugify");
const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product Title required")
    .isLength({ min: 3 })
    .withMessage("Too Short Product Name")
    .isLength({ max: 100 })
    .withMessage("Too Long Product Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product Description required")
    .isLength({ min: 20 })
    .withMessage("Too Short Product Description")
    .isLength({ max: 2000 })
    .withMessage("Too Long Product Description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity Must Be Number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product Sold Must Be Number"),
  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Product Price Must Be Number")
    .isFloat({ max: 200000 })
    .withMessage("Too Long Number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product Price Must Be Number")
    .toFloat()
    .isLength({ max: 32 })
    .withMessage("Too Long Number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "price After Discount Must Be Lower Than The Current Price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("The Available Colors Must Be Array Of String"),
  check("images")
    .optional()
    .isArray()
    .withMessage("The Available Images Must Be Array Of String"),
  check("imageCover").notEmpty().withMessage("Product Image Cover is required"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Product Price Must Be Number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0"),
  check("imageCover").notEmpty().withMessage("Product Image cover is required"),
  check("category")
    .notEmpty()
    .withMessage("Category Id required")
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`Not Category For This Id : ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid SubCategory Id Format")
    .custom((ids) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: ids } })
        .then((result) => {
          if (result.length < 1 || result.length < ids.length) {
            return Promise.reject(new Error(`Invalid SubCategories Ids`));
          }
        })
    )
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          const subCategoriesId = subCategories.map((e) => e._id.toString());
          const checkId = val.every((element) =>
            subCategoriesId.includes(element)
          );
          if (!checkId) {
            return Promise.reject(
              new Error(`The SubCategories Not Belong To Category`)
            );
          }
        })
    ),
  check("brand").optional().isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id Format"),
  validatorMiddleware,
];
