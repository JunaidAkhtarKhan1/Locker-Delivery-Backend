const express = require("express");
const router = express.Router();

const { rechargeRfid } = require("../../controllers/transaction/rechargeRfid.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], rechargeRfid);

module.exports = router;