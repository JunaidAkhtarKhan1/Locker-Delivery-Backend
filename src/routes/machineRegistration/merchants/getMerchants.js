const express = require("express");
const router = express.Router();

const {
  getMerchants,
} = require("../../../controllers/machineRegistration/merchants/getMerchants.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], getMerchants);

module.exports = router;
