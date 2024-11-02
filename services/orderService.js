const asyncHandler = require("express-async-handler");

const stripe = require("stripe")(
  "sk_test_51QEbQ4KxKEwo0eCACaoVbks8kRRXjxtriikGdjwCJddJj2COieEZ1PuJzdeXgiAhKs93oX65qT0PRyEUACGzqoYI00UDfv73Mz"
);

const ApiError = require("../utils/apiError");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const { getAll, getOne } = require("./refactorHandler");
const userModel = require("../models/userModel");

// @desc create Cash Order
// @route POST /api/v1/order/cartId
// @access private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError("you don't have cart yet", 404));
  }
  let totalPrice = cart.totalPriceAfterDis
    ? cart.totalPriceAfterDis
    : cart.totalPrice;
  totalPrice = totalPrice + taxPrice + shippingPrice;

  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalPrice,
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).send({
    status: "success",
    message: "order created Successfully",
    data: order,
  });
});

exports.filterOrder = async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  } else {
    req.filterObj = {};
  }
  next();
};

// @desc get all Orders
// @route GET /api/v1/order
// @access private/admin-manager-user
exports.getAllOrders = getAll(orderModel);

// @desc get specific Order
// @route GET /api/v1/order/:id
// @access private/admin-manager-user
exports.getOrder = getOne(orderModel);

// @desc update status Order to paid
// @route PUT /api/v1/order/:id/pay
// @access private/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { isPaid: true, paidAt: Date.now() },
    { new: true }
  );

  if (!order) {
    return next(new ApiError("order not found", 404));
  }

  res.status(200).send({ status: "success", data: order });
});

// @desc update status Order to delivered
// @route PUT /api/v1/order/:id/deliver
// @access private/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { isDelivered: true, deliveredAt: Date.now() },
    { new: true }
  );

  if (!order) {
    return next(new ApiError("order not found", 404));
  }

  res.status(200).send({ status: "success", data: order });
});

// @desc checkOut Session
// @route GET /api/v1/order/:cartId
// @access private/user
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError("you don't have cart yet", 404));
  }
  let totalPrice = cart.totalPriceAfterDis
    ? cart.totalPriceAfterDis
    : cart.totalPrice;
  totalPrice = totalPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/products`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/products`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });

  res.status(200).send({ status: "success", session });
});

const webhookFun = asyncHandler(async (session) => {
  const email = session.customer_email;
  const totalPrice = session.amount_total / 100;
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;

  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email });

  const order = await orderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(cartId);
    console.log("Process Completed Successfully");
  } else {
    console.log("There Are Error in creating Order");
  }
});

// @desc create online Order
// @route POST /checkoutWebhook
// @access private/user
exports.checkoutWebhook = asyncHandler(async (req, res, next) => {
  if (req.originalUrl === "/favicon.ico") {
    return res.status(204).end(); // تجاهل طلب favicon.ico
  }

  let event = req.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (process.env.STRIPE_Signing_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_Signing_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  if (event.type === "checkout.session.completed") {
    webhookFun(event.data.object);
  }

  res.send({ recevied: true });
});
