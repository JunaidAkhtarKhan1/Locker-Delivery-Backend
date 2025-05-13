const express = require("express");
const router = express.Router();
// const validator = require('express-joi-validation').createValidator({})
// const { querySchema } = require('../../models/payment.model');

const { postPayment, qrWithEncryption } = require("../../controllers/payments/postQR.controller");
// const auth = require("../../middleware/auth");

// router.post("/", postPayment);
router.post("/", qrWithEncryption);

module.exports = router;