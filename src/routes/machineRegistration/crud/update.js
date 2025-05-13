const express = require("express");
const router = express.Router();

const { update } = require("../../../controllers/machineRegistration/crud/update.controller");
const auth = require("../../../middleware/auth");

router.put("/", [auth], update);

module.exports = router;
