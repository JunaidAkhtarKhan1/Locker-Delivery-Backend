const express = require("express");
const router = express.Router();

const {
  raastPaymentConfirmation,
} = require("../../controllers/payfastConfirmation/raastConfirmation.controller");

router.post("/", raastPaymentConfirmation);

module.exports = router;
