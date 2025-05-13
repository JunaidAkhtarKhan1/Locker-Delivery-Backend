const express = require("express");
const router = express.Router();
// const validator = require('express-joi-validation').createValidator({})
// const { querySchema } = require('../../models/payment.model');

const { postPayment, maWithoutEncryption } = require("../../controllers/payments/postPayment.controller");
// const auth = require("../../middleware/auth");

// router.post("/", postPayment);
router.post("/", maWithoutEncryption);

module.exports = router;