const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review Rating Is Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Must Be Between 1.0 And 5.0"),
  check("user")
    .notEmpty()
    .withMessage("Review Must Belong To User")
    .isMongoId()
    .withMessage("Invalid User Id Format"),
  check("product")
    .notEmpty()
    .withMessage("Review Must Belong To Product")
    .isMongoId()
    .withMessage("Invalid Product Id Format")
    .custom((val, { req }) =>
      reviewModel
        .findOne({ user: req.user._id, product: req.body.product })
        .then((res) => {
          if (res) {
            return Promise.reject(
              new Error("You Reviewed This Product Before")
            );
          }
        })
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("The Review Not Found"));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You Are Not Allowed To Edit This Review")
          );
        }
      })
    ),
  check("title").optional(),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Must Be Between 1.0 And 5.0"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id Format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("The Review Not Found"));
          }

          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You Are Not Allowed To Delete This Review")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
