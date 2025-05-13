const express = require("express");
const router = express.Router();

const { transactionComplete } = require("../../controllers/transaction/transactionComplete.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], transactionComplete);

module.exports = router;