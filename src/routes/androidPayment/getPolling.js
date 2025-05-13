const express = require("express");
const router = express.Router();

const {
  getPolling,
} = require("../../controllers/androidPayment/getPolling.controller");

router.get("/", getPolling);

module.exports = router;
