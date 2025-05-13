const express = require("express");
const router = express.Router();

const {
  postAllPaymentMethods,
} = require("../../../controllers/machineRegistration/paymentMethods/postPaymentMethods.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], postAllPaymentMethods);

module.exports = router;
