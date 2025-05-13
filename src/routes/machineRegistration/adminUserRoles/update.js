const express = require("express");
const router = express.Router();

const {
  updateAdminUserRoles,
} = require("../../../controllers/machineRegistration/adminUserRoles/update.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateAdminUserRoles);

module.exports = router;
