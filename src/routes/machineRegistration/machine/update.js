const express = require("express");
const router = express.Router();

const {
  updateMachine,
} = require("../../../controllers/machineRegistration/machine/update.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateMachine);

module.exports = router;
