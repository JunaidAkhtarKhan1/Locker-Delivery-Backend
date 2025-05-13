const express = require("express");
const router = express.Router();

const {
  androidPayment,
} = require("../../controllers/androidPayment/androidPayment.controller");

router.post("/", androidPayment);

module.exports = router;
