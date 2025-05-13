const express = require("express");
const router = express.Router();

const {
  updateAllPaymentMethods,
} = require("../../../controllers/machineRegistration/paymentMethods/updatePaymentMethods.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateAllPaymentMethods);

module.exports = router;
