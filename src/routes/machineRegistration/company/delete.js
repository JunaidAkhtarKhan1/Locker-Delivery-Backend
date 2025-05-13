const express = require("express");
const router = express.Router();

const {
  deleteCompany,
} = require("../../../controllers/machineRegistration/company/delete.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteCompany);

module.exports = router;
