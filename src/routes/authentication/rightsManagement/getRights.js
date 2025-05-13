const express = require("express");
const router = express.Router();

const {
  getAllRightsManagement,
} = require("../../../controllers/authentication/rightsManagement/getRights.controller");
const auth = require("../../../middleware/auth");
const superAdmin = require("../../../middleware/superAdmin");

router.get("/", [auth], getAllRightsManagement);

module.exports = router;
