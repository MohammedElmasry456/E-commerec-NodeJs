const express = require("express");
const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  setBrandImage,
  uploadBrandImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidtator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    setBrandImage,
    createBrandValidator,
    createBrand
  )
  .get(getAllBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    setBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
