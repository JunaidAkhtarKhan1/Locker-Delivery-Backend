const express = require("express");
const router = express.Router();

const { easypaisaTransactionConfirmation } = require("../../controllers/transactionConfirmation/epTransactionConfirmation.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], easypaisaTransactionConfirmation);

module.exports = router;
