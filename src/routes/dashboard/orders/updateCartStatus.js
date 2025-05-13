const express = require("express");
const router = express.Router();

const {
  updateCartStatus,
} = require("../../../controllers/dashboard/orders/updateCartStatus.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateCartStatus);

module.exports = router;
