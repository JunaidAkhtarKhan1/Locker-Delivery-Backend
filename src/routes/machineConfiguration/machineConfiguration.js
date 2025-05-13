const express = require("express");
const router = express.Router();

const {
  machineConfiguration,
} = require("../../controllers/machineConfiguration/machineConfiguration.controller");
const auth = require("../../middleware/auth");

router.post("/", [auth], machineConfiguration);

module.exports = router;
