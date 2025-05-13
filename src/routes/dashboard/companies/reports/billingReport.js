const express = require("express");
const router = express.Router();

const {
  billingReport,
} = require("../../../../controllers/dashboard/companies/reports/billingReport.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], billingReport);

module.exports = router;
