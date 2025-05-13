const express = require("express");
const router = express.Router();

const {
  generateOrders,
} = require("../../../controllers/dashboard/orders/generateOrder.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], generateOrders);

module.exports = router;
