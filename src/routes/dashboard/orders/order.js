const express = require("express");
const router = express.Router();

const {
  orderList,
} = require("../../../controllers/dashboard/orders/order.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");

// router.post("/", [auth], orderList);
router.get("/", [auth], orderList);

module.exports = router;
