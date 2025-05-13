const express = require("express");
const router = express.Router();

const {
  postAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/postRoles.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], postAllRolesManagement);

module.exports = router;
