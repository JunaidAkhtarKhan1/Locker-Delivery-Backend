const express = require("express");
const router = express.Router();

const {
  updateRfidData,
} = require("../../../../controllers/dashboard/companies/employeeData/updateRfidData.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], updateRfidData);

module.exports = router;
