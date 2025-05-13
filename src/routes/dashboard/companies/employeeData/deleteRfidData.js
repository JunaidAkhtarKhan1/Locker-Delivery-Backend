const express = require("express");
const router = express.Router();

const {
  deleteRfidData,
} = require("../../../../controllers/dashboard/companies/employeeData/deleteRfidData.controller");
const auth = require("../../../../middleware/auth");

router.post("/", [auth], deleteRfidData);

module.exports = router;
