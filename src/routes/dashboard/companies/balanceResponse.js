const express = require("express");
const router = express.Router();

const { balanceResponseCompany } = require("../../../controllers/dashboard/companies/balanceResponse.controller");
const auth = require("../../../middleware/auth");
const staffAdmin = require("../../../middleware/staffAdmin");

router.post("/", [auth, staffAdmin], balanceResponseCompany);

module.exports = router;
