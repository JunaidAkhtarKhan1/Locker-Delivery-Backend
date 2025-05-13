const express = require("express");
const router = express.Router();

const {
  updateAllRightsManagement,
} = require("../../../controllers/authentication/rightsManagement/updateRights.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], updateAllRightsManagement);

module.exports = router;
