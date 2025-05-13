const express = require("express");
const router = express.Router();

const {
  createAdminUserRoles,
} = require("../../../controllers/machineRegistration/adminUserRoles/create.controller");
const auth = require("../../../middleware/auth");
// const admin = require("../../../middleware/admin");
// const partner = require("../../../middleware/partner");
// const staffAdmin = require("../../../middleware/staffAdmin");
// const superAdmin = require("../../../middleware/superAdmin");

router.post("/", [auth], createAdminUserRoles);

module.exports = router;
