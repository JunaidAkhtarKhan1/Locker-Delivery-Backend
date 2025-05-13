const express = require("express");
const router = express.Router();

const { machineSignup } = require("../../controllers/authentication/machineSignup.controller");

router.post("/", machineSignup);

module.exports = router;