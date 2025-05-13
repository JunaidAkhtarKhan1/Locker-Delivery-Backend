const express = require("express");
const router = express.Router();

const { displayBalanceRequest } = require("../../../controllers/dashboard/companies/displayRequests.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], displayBalanceRequest);

module.exports = router;
