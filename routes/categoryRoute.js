const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  setCategoryImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidtator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    setCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    setCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
