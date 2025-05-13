const express = require("express");
const router = express.Router();

const {
  deleteMachine,
} = require("../../../controllers/machineRegistration/machine/delete.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteMachine);

module.exports = router;
