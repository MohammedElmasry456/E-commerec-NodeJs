const express = require("express");
const {
  uploadUserImage,
  resizeUserImage,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  changeUserPassword,
  getLoggedUser,
  changeMyPassword,
  updateMe,
  deleteLoggedUser,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidtator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect);

// Proile
router.get("/getMe", getLoggedUser, getUser);
router.put("/changeMyPassword", changeMyPassword);
router.put(
  "/updateMe",
  uploadUserImage,
  resizeUserImage,
  updateLoggedUserValidator,
  updateMe
);
router.put("/deleteMe", deleteLoggedUser);

// Admin
router.use(allowedTo("admin", "manager"));

router.put("/changePassword/:id", changePasswordValidator, changeUserPassword);
router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getAllUsers);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
