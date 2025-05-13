const express = require("express");
const router = express.Router();

const {
  getAllPaymentMethods,
} = require("../../../controllers/machineRegistration/paymentMethods/getPaymentMethods.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], getAllPaymentMethods);

module.exports = router;
