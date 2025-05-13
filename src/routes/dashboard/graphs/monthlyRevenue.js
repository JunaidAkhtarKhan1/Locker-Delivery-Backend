const express = require("express");
const router = express.Router();

const {
  monthlyRevenueGraph,
} = require("../../../controllers/dashboard/graphs/monthlyRevenue.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], monthlyRevenueGraph);

module.exports = router;
