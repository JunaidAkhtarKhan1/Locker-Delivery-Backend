const express = require("express");
const router = express.Router();

const { createMachine } = require("../../../controllers/machineRegistration/machine/create.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], createMachine);

module.exports = router;
