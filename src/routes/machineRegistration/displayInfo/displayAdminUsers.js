const express = require("express");
const router = express.Router();

const { readAdminUsers } = require("../../../controllers/machineRegistration/displayInfo/displayAdminUsers.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readAdminUsers);

module.exports = router;
