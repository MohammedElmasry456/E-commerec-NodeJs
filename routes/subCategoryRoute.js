const express = require("express");
const {
  createSubcategory,
  getSubcategory,
  getAllSubcategories,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  setQueryToBody,
} = require("../services/subCategoryService");
const {
  createSubcategoryValidator,
  getSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subCategoryValidtator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubcategoryValidator,
    createSubcategory
  )
  .get(setQueryToBody, getAllSubcategories);

router
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubcategoryValidator,
    updateSubcategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubcategoryValidator,
    deleteSubcategory
  );

module.exports = router;
