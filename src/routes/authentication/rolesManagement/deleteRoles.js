const express = require("express");
const router = express.Router();

const {
  deleteAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/deleteRoles.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], deleteAllRolesManagement);

module.exports = router;
