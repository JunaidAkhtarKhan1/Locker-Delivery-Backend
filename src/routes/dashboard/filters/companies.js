const express = require("express");
const router = express.Router();

const { companies } = require("../../../controllers/dashboard/filters/companies.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const staffAdmin = require("../../../middleware/staffAdmin");
const staffFinance = require("../../../middleware/staffFinance");
const staffHR = require("../../../middleware/staffHR");

router.get("/", [auth], companies);

module.exports = router;
