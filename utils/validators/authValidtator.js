const { check } = require("express-validator");
const slugify = require("slugify");

const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Email Invaild")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("The Email Already Found"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User Password required")
    .isLength({ min: 6 })
    .withMessage("Too Short User Password")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Confirm Password Incorrect");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("User Confirm Password required"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("password")
    .notEmpty()
    .withMessage("User Password required")
    .isLength({ min: 6 })
    .withMessage("Too Short User Password"),
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Email Invaild"),
  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Email Invaild"),
  validatorMiddleware,
];
