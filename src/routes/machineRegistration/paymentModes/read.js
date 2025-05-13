const express = require("express");
const router = express.Router();

const { readPaymentMode } = require("../../../controllers/machineRegistration/paymentModes/read.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readPaymentMode);

module.exports = router;
