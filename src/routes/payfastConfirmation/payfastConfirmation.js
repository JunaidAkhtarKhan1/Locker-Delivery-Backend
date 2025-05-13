const express = require("express");
const router = express.Router();

const {
  payfastPaymentConfirmation,
} = require("../../controllers/payfastConfirmation/payfastConfirmation.controller");

router.post("/", payfastPaymentConfirmation);

module.exports = router;
