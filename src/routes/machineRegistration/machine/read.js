const express = require("express");
const router = express.Router();

const { readMachine } = require("../../../controllers/machineRegistration/machine/read.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readMachine);

module.exports = router;
