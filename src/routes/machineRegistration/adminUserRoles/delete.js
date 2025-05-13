const express = require("express");
const router = express.Router();

const {
  deleteAdminUserRoles,
} = require("../../../controllers/machineRegistration/adminUserRoles/delete.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteAdminUserRoles);

module.exports = router;
