const express = require("express");
const router = express.Router();

const { readAdminUserRoles } = require("../../../controllers/machineRegistration/adminUserRoles/read.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], readAdminUserRoles);

module.exports = router;
