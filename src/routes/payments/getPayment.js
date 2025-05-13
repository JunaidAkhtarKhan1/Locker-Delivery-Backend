const express = require("express");
const router = express.Router();

const { getPayment } = require("../../controllers/payments/getPayment.controller");
const auth = require("../../middleware/auth");

router.get("/", getPayment);

module.exports = router;
