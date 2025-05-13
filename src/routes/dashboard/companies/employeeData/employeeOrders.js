const express = require("express");
const router = express.Router();

const {
  displayEmployeeOrders,
} = require("../../../../controllers/dashboard/companies/employeeData/employeeOrders.controller");
const auth = require("../../../../middleware/auth");
const admin = require("../../../../middleware/admin");

router.post("/", [auth], displayEmployeeOrders);

module.exports = router;
