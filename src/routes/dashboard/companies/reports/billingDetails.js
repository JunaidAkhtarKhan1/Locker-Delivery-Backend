const express = require("express");
const router = express.Router();

const {
  billingDetails,
} = require("../../../../controllers/dashboard/companies/reports/billingDetails.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], billingDetails);

module.exports = router;
