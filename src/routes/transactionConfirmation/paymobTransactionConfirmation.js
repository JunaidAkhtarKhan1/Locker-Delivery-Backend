const express = require("express");
const router = express.Router();

const { paymobTransactionConfirmation } = require("../../controllers/transactionConfirmation/paymobTransactionConfirmation.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], paymobTransactionConfirmation);

module.exports = router;