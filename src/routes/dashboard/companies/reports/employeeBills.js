const express = require("express");
const router = express.Router();

const {
  employeeBillings,
} = require("../../../../controllers/dashboard/companies/reports/employeeBills.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], employeeBillings);

module.exports = router;
