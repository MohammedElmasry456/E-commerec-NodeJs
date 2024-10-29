const bcryptjs = require("bcryptjs");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const { deleteOne, createOne, getOne, getAll } = require("./refactorHandler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }
  next();
});

// @desc create user
// @route POST /api/v1/users
// @access private
exports.createUser = createOne(userModel);

// @desc get list of users
// @route GET /api/v1/users
// @access private
exports.getAllUsers = getAll(userModel);

// @desc get specific user by id
// @route GET /api/v1/users/:id
// @access private
exports.getUser = getOne(userModel);

// @desc update specific user
// @route PUT /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const User = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      slug: req.body.slug,
      active: req.body.active,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!User) {
    return next(new ApiError(`not User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: User });
});

// @desc update specific user Password
// @route PUT /api/v1/users/changePassword/:id
// @access private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const User = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcryptjs.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!User) {
    return next(new ApiError(`not User for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: User });
});

// @desc delete specific user
// @route DELETE /api/v1/users/:id
// @access private
exports.deleteUser = deleteOne(userModel);

// @desc get my
// @route GET /api/v1/users/getMY
// @access private
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc change my password
// @route PUT /api/v1/users/changeMyPassword
// @access private
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcryptjs.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc update my data
// @route PUT /api/v1/users/updateMe
// @access private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.password,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ data: user });
});

// @desc deactive my account
// @route PUT /api/v1/users/deleteMe
// @access private
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: "false" });
  res.status(204).json({ status: "success" });
});
