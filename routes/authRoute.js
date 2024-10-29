const express = require("express");
const {
  signUpValidator,
  loginValidator,
  forgetPasswordValidator,
} = require("../utils/validators/authValidtator");
const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signUp", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;