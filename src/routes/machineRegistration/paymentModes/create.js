const express = require("express");
const router = express.Router();

const { createPaymentMode } = require("../../../controllers/machineRegistration/paymentModes/create.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], createPaymentMode);

module.exports = router;
