const express = require("express");
const router = express.Router();

const {
  weeklySalesGraph,
} = require("../../../controllers/dashboard/graphs/weeklySales.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], weeklySalesGraph);

module.exports = router;
