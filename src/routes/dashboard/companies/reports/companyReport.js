const express = require("express");
const router = express.Router();

const { companyReport } = require("../../../../controllers/dashboard/companies/reports/companyReport.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], companyReport);

module.exports = router;
