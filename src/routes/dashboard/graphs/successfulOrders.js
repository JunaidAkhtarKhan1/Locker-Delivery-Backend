const express = require("express");
const router = express.Router();

const {
  successfulOrdersGraph,
} = require("../../../controllers/dashboard/graphs/successfulOrders.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], successfulOrdersGraph);

module.exports = router;
