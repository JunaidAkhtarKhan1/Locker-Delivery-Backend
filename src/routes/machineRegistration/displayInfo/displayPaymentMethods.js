const express = require("express");
const router = express.Router();

const { readPaymentMethods } = require("../../../controllers/machineRegistration/displayInfo/displayPaymentMethods.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readPaymentMethods);

module.exports = router;
