const express = require("express");
const router = express.Router();

const { readAdminRoles } = require("../../../controllers/machineRegistration/displayInfo/displayAdminRoles.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readAdminRoles);

module.exports = router;
