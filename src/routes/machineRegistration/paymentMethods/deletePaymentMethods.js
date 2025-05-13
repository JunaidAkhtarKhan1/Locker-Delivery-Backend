const express = require("express");
const router = express.Router();

const {
  deleteAllPaymentMethods,
} = require("../../../controllers/machineRegistration/paymentMethods/deletePaymentMethods.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteAllPaymentMethods);

module.exports = router;
