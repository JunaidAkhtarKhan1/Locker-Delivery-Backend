const express = require("express");
const router = express.Router();

const { employeeActivation } = require("../../../controllers/dashboard/companies/employeeStatus.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], employeeActivation);

module.exports = router;
