const express = require("express");
const router = express.Router();

const { read } = require("../../../controllers/machineRegistration/crud/read.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], read);

module.exports = router;
