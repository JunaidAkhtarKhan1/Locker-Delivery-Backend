const express = require("express");
const router = express.Router();

const {
  deleteAllBanks,
} = require("../../../controllers/machineRegistration/banks/deleteBanks.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteAllBanks);

module.exports = router;
