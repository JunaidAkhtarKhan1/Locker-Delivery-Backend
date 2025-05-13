const express = require("express");
const router = express.Router();

const {
  postCashSale,
} = require("../../controllers/cashSale/cashSale.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], postCashSale);

module.exports = router;
