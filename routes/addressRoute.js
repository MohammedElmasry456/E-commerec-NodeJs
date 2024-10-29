const express = require("express");
const { protect, allowedTo } = require("../services/authService");

const {
  addAddressToUser,
  removeAddressFromUser,
  getAddresses,
} = require("../services/addressesService");
const {
  addAddressToUserValidator,
} = require("../utils/validators/userValidtator");

const router = express.Router();
router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addAddressToUserValidator, addAddressToUser)
  .get(getAddresses);
router.route("/:addressId").delete(removeAddressFromUser);

module.exports = router;
