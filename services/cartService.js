const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((el) => {
    totalPrice += el.quantity * el.price;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDis = undefined;
};

// @desc add Product To Cart
// @route POST /api/v1/cart
// @access private
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  let cart = await cartModel.findOne({ user: req.user._id });
  const product = await productModel.findById(productId);

  if (!cart) {
    cart = await cartModel.create({
      cartItems: [{ product: productId, color, price: product.price }],
      user: req.user._id,
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.color === color && item.product.toString() === productId
    );

    if (itemIndex > -1) {
      const item = cart.cartItems[itemIndex];
      item.quantity += 1;
      cart.cartItems[itemIndex] = item;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calcTotalPrice(cart);
  await cart.save();

  res.status(200).send({
    status: "success",
    message: "product Added To Cart Successfully",
    data: cart,
  });
});

// @desc get all Product from Cart
// @route GET /api/v1/cart
// @access private/user
exports.getProductsFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    next(new ApiError("Cart Not Found", 404));
  }
  res.status(200).send({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc remove Product from Cart
// @route DELETE /api/v1/cart/:itemId
// @access private/user
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    next(new ApiError("Cart Not Found", 404));
  }

  calcTotalPrice(cart);
  cart.save();
  res.status(200).send({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc update Product quantity at Cart
// @route PUT /api/v1/cart/:itemId
// @access private/user
exports.updateProductQuantity = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (el) => el._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    const item = cart.cartItems[itemIndex];
    item.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = item;
  } else {
    return next(
      new ApiError(`Item Not Found For THis Id : ${req.params.itemId}`, 404)
    );
  }

  calcTotalPrice(cart);
  cart.save();
  res.status(200).send({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc apply Coupon At Cart
// @route PUT /api/v1/cart/applyCoupon
// @access private/user
exports.applyCouponAtCart = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.name,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("coupon Not valid Or Expired", 400));
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  const { totalPrice } = cart;
  const totalPriceAfterDis = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDis = totalPriceAfterDis;

  await cart.save();
  res.status(200).send({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc remove Cart
// @route DELETE /api/v1/cart
// @access private/user
exports.removeCart = asyncHandler(async (req, res) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
