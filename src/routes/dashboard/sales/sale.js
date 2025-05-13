const express = require("express");
const router = express.Router();

const {
  saleList,
} = require("../../../controllers/dashboard/sales/sale.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");

router.post("/", [auth], saleList);

module.exports = router;
