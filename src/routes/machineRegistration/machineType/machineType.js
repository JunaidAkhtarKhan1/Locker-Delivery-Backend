const express = require("express");
const router = express.Router();

const {
  readMachineType,
} = require("../../../controllers/machineType/machineType.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readMachineType);

module.exports = router;
