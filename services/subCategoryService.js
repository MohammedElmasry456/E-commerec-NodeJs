const subCategoryModel = require("../models/subCategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./refactorHandler");

exports.setCategoryIdToBody = (req, res, next) => {
  req.body.category = req.body.category
    ? req.body.category
    : req.params.categoryId;
  next();
};

// @desc create subcategory
// @route POST /api/v1/subcategories
// @access private
exports.createSubcategory = createOne(subCategoryModel);

// @Nested route
// @route /api/v1/categories/:categoryId/subcategories
exports.setQueryToBody = (req, res, next) => {
  req.filterObj = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  next();
};

// @desc get All subcategories
// @route GET /api/v1/subcategories
// @access puplic
exports.getAllSubcategories = getAll(subCategoryModel);
// @desc get specific subcategory by id
// @route GET /api/v1/subcategories/:id
// @access puplic
exports.getSubcategory = getOne(subCategoryModel);

// @desc update specific subcategory
// @route PUT /api/v1/subcategories/:id
// @access private
exports.updateSubcategory = updateOne(subCategoryModel);

// @desc delete specific subcategory
// @route DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubcategory = deleteOne(subCategoryModel);
