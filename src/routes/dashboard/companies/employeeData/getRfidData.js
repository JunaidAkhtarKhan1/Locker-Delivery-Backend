const express = require("express");
const router = express.Router();

const { getRfidData } = require("../../../../controllers/dashboard/companies/employeeData/getRfidData.controller");
const auth = require("../../../../middleware/auth");

router.get("/", [auth], getRfidData);

module.exports = router;
