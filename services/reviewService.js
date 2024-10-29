const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");
const reviewModel = require("../models/reviewModel");

//for filter
exports.setQueryToBody = (req, res, next) => {
  req.filterObj = req.params.productId ? { product: req.params.productId } : {};
  next();
};

// for create specific review
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  req.body.product = req.body.product ? req.body.product : req.params.productId;
  req.body.user = req.body.user ? req.body.user : req.user._id;
  next();
};

// @desc create review
// @route POST /api/v1/reviews
// @access private/protect/user
exports.createReview = createOne(reviewModel);

// @desc get list of reviews
// @route GET /api/v1/reviews
// @access puplic
exports.getAllReviews = getAll(reviewModel);

// @desc get specific review by id
// @route GET /api/v1/reviews/:id
// @access puplic
exports.getReview = getOne(reviewModel);

// @desc update specific review
// @route PUT /api/v1/reviews/:id
// @access private/protect/user
exports.updateReview = updateOne(reviewModel);

// @desc delete specific review
// @route DELETE /api/v1/reviews/:id
// @access private/protect/user-admin-manager
exports.deleteReview = deleteOne(reviewModel);
