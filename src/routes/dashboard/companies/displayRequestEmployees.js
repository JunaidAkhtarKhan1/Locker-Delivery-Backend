const express = require("express");
const router = express.Router();

const { displayRequestBalanceEmployees } = require("../../../controllers/dashboard/companies/displayRequestEmployees.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], displayRequestBalanceEmployees);

module.exports = router;
