const express = require("express");
const router = express.Router();

const {
  createMachineEnv,
} = require("../../../controllers/machineRegistration/machine/machineEnv.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], createMachineEnv);

module.exports = router;
