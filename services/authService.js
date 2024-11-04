const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendMail");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/validators/sanitizeData");

// @desc signUp
// @route POST /api/v1/auth/signUp
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(newUser._id);
  res.status(201).json({ date: sanitizeUser(newUser), token });
});

// @desc login
// @route POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
    return next(new ApiError("Error In Email Or Password", 401));
  }

  const token = createToken(user._id);
  res.status(200).json({ date: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You Are Not Login, Please Login Again", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decode.userId);
  if (!user) {
    return next(
      new ApiError(
        "The User That Belong To This Token Does't Longer Exist",
        401
      )
    );
  }

  if (!user.active) {
    return next(
      new ApiError("You Must Active Your Account To Access This Route", 400)
    );
  }

  if (user.passwordChangedAt) {
    const changeTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
    if (changeTime > decode.iat) {
      return next(
        new ApiError("The Password Changed, Please Login Again", 401)
      );
    }
  }
  req.user = user;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You Are Not Allowed To Access This Route", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("Email Not Belong To User", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(resetCode).digest("hex");
  user.PasswordResetCode = hash;
  user.PasswordResetCodeExpire = Date.now() + 10 * 60 * 1000;
  user.PasswordResetVerified = false;
  await user.save();

  try {
    await sendMail({
      email: user.email,
      subject: "Reset Code Will Expire After 10 min",
      message: `<h1 style="color:red;">reset code : </h1>${resetCode}`,
    });
  } catch (error) {
    user.PasswordResetCode = undefined;
    user.PasswordResetCodeExpire = undefined;
    user.PasswordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Error In Sending Email", 500));
  }

  res
    .status(200)
    .send({ status: "success", message: "Reset Code Send Successfully" });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    PasswordResetCode: crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex"),
    PasswordResetCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code Invalid Or Expired", 400));
  }

  user.PasswordResetVerified = true;
  await user.save();
  res.status(200).send({ status: "success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ApiError("The Email Not Belong To User", 404));
  }

  if (!user.PasswordResetVerified) {
    return next(new ApiError("You Don't Verify The Reset Code", 400));
  }

  user.password = req.body.newPassword;
  user.PasswordResetCode = undefined;
  user.PasswordResetCodeExpire = undefined;
  user.PasswordResetVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).send({ token });
});
