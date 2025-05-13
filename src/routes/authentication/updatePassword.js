const express = require("express");
const router = express.Router();
// const validator = require('express-joi-validation').createValidator({})
// const { querySchema } = require('../../models/users.model');

const {
  updatePassword,
} = require("../../controllers/authentication/updatePassword.controller");

const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
// const partner = require("../../middleware/partner");
// const staffAdmin = require("../../middleware/staffAdmin");

router.post("/", [auth, admin], updatePassword);

module.exports = router;
