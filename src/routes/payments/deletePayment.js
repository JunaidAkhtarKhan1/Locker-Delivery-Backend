const express = require("express");
const router = express.Router();

const { deletePayment } = require("../../controllers/payments/deletePayment.controller");
const auth = require("../../middleware/auth");

router.delete("/", deletePayment);

module.exports = router;
