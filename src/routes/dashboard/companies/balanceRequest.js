const express = require("express");
const router = express.Router();

const { balanceRequestCompany } = require("../../../controllers/dashboard/companies/balanceRequest.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], balanceRequestCompany);

module.exports = router;
