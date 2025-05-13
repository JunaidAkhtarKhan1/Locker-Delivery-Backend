const express = require("express");
const router = express.Router();

const { deleted } = require("../../../controllers/machineRegistration/crud/delete.controller");
const auth = require("../../../middleware/auth");

router.delete("/", [auth], deleted);

module.exports = router;
