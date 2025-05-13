const express = require("express");
const router = express.Router();

const {
  postAllBanks,
} = require("../../../controllers/machineRegistration/banks/postBanks.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], postAllBanks);

module.exports = router;
