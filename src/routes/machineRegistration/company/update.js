const express = require("express");
const router = express.Router();

const {
  updateCompany,
} = require("../../../controllers/machineRegistration/company/update.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateCompany);

module.exports = router;
