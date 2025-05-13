const express = require("express");
const router = express.Router();

const {
  getAllBanks,
} = require("../../../controllers/machineRegistration/banks/getBanks.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], getAllBanks);

module.exports = router;
