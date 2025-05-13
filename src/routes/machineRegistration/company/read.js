const express = require("express");
const router = express.Router();

const {
  readCompany,
} = require("../../../controllers/machineRegistration/company/read.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readCompany);

module.exports = router;
