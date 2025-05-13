const express = require("express");
const router = express.Router();

const {
  saleDetail,
} = require("../../../controllers/dashboard/sales/saleDetail.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");

router.post("/", [auth], saleDetail);

module.exports = router;
