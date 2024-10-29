const bcryptjs = require("bcryptjs");
const { check } = require("express-validator");
const slugify = require("slugify");

const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too Short User Name")
    .isLength({ max: 32 })
    .withMessage("Too long User Name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  check("confirmPassword").notEmpty().withMessage("Confirm Password required"),
  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Email Invaild")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is Already Found"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Mobile Number Egypt Or Saudia Valid Phone Number"),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Email Invaild")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is Already Found"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Mobile Number Egypt Or Saudia Valid Phone Number"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Email Invaild")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is Already Found"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid Mobile Number Egypt Or Saudia Valid Phone Number"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  check("currentPassword").notEmpty().withMessage("Current Password required"),
  check("confirmPassword").notEmpty().withMessage("Confirm Password required"),
  check("password")
    .notEmpty()
    .withMessage("New Password required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User Not Found");
      }
      const isCorrect = await bcryptjs.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("Incorrect User Current Password");
      }

      if (val !== req.body.confirmPassword) {
        throw new Error("Confirm Password Incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.addAddressToUserValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias address required")
    .custom((val, { req }) =>
      userModel.findById(req.user._id).then((res) => {
        if (res.addresses) {
          const check_ = res.addresses.every((el) => el.alias !== val);
          if (!check_) {
            return Promise.reject(new Error("alias address is already exist"));
          }
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id Format"),
  validatorMiddleware,
];
