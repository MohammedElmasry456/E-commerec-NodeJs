const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  setQueryToBody,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidtator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  )
  .get(setQueryToBody, getAllReviews);
router
  .route("/:id")
  .get(getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
