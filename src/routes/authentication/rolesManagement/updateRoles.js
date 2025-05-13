const express = require("express");
const router = express.Router();

const {
  updateAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/updateRoles.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateAllRolesManagement);

module.exports = router;
