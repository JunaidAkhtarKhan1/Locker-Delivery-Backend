const express = require("express");
const router = express.Router();

const {
  postAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/postRoles.controller");
const auth = require("../../../middleware/auth");
const superAdmin = require("../../../middleware/superAdmin");

router.post("/", [auth, superAdmin], postAllRolesManagement);

module.exports = router;
