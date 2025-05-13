const express = require("express");
const router = express.Router();

const {
  liveTransaction,
} = require("../../controllers/transaction/transaction.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], liveTransaction);

module.exports = router;
