const express = require("express");
const router = express.Router();

const {
  getAllRolesManagement,
} = require("../../../controllers/authentication/rolesManagement/getRoles.controller");
const auth = require("../../../middleware/auth");

router.get("/", [auth], getAllRolesManagement);

module.exports = router;
