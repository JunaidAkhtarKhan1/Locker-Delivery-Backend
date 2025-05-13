const express = require("express");
const router = express.Router();

const {
  createCompany,
} = require("../../../controllers/machineRegistration/company/create.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], createCompany);

module.exports = router;
