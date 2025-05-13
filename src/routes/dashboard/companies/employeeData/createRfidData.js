const express = require("express");
const router = express.Router();

const { createRfidData } = require("../../../../controllers/dashboard/companies/employeeData/createRfidData.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], createRfidData);

module.exports = router;
