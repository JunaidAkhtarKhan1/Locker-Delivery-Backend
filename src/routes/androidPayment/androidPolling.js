const express = require("express");
const router = express.Router();

const {
  androidPolling,
} = require("../../controllers/androidPayment/androidPolling.controller");

router.post("/", androidPolling);

module.exports = router;
