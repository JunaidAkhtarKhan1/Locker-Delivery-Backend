const express = require("express");
const router = express.Router();

const {
  deleteAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/deleteRoles.controller");
const auth = require("../../../middleware/auth");
const superAdmin = require("../../../middleware/superAdmin");

router.post("/", [auth, superAdmin], deleteAllRolesManagement);

module.exports = router;
