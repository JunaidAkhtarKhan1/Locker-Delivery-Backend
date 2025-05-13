const express = require("express");
const router = express.Router();

const {
  updatePaymentMode,
} = require("../../../controllers/machineRegistration/paymentModes/update.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updatePaymentMode);

module.exports = router;
