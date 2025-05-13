const express = require("express");
const router = express.Router();

const { create } = require("../../../controllers/machineRegistration/crud/create.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], create);

module.exports = router;
