const express = require("express");
const router = express.Router();
const validator = require('express-joi-validation').createValidator({})
const { querySchema } = require('../../models/payment.model');

const { updatePayment } = require("../../controllers/payments/updatePayment.controller");
const auth = require("../../middleware/auth");

router.put("/", validator.body(querySchema), updatePayment);

module.exports = router;
