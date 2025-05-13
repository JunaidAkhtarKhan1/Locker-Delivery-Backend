const express = require("express");
const router = express.Router();

const {
  updateAllBanks,
} = require("../../../controllers/machineRegistration/banks/updateBanks.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateAllBanks);

module.exports = router;
