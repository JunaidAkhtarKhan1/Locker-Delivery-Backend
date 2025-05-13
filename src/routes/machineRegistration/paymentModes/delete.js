const express = require("express");
const router = express.Router();

const {
  deletePaymentMode,
} = require("../../../controllers/machineRegistration/paymentModes/delete.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deletePaymentMode);

module.exports = router;
