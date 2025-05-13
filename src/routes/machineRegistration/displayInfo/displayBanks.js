const express = require("express");
const router = express.Router();

const { readBanks } = require("../../../controllers/machineRegistration/displayInfo/displayBanks.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readBanks);

module.exports = router;
