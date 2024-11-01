const express = require("express");

const { protect, allowedTo } = require("../services/authService");
const {
  createCashOrder,
  getAllOrders,
  filterOrder,
  getOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkOutSession,
} = require("../services/orderService");

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(allowedTo("user", "admin", "manager"), filterOrder, getAllOrders);
router.route("/checkOut/:cartId").get(allowedTo("user"), checkOutSession);
router.route("/:cartId").post(allowedTo("user"), createCashOrder);

router
  .route("/:id/deliver")
  .put(allowedTo("admin", "manager"), updateOrderToDelivered);
router.route("/:id/pay").put(allowedTo("admin", "manager"), updateOrderToPaid);

router.route("/:id").get(allowedTo("user", "admin", "manager"), getOrder);

module.exports = router;
