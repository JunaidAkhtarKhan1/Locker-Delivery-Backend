const express = require("express");
const router = express.Router();

const {
  postMerchants,
} = require("../../../controllers/machineRegistration/merchants/postMerchants.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], postMerchants);

module.exports = router;
