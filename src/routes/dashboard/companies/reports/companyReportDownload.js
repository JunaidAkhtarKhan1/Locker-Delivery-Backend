const express = require("express");
const router = express.Router();

const { companyReportDownload } = require("../../../../controllers/dashboard/companies/reports/companyReportDownload.controller");
const auth = require("../../../../middleware/auth");

router.get("/", [], companyReportDownload);

module.exports = router;
