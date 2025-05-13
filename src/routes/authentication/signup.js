const express = require("express");
const router = express.Router();
// const validator = require('express-joi-validation').createValidator({})
// const { querySchema } = require('../../models/users.model');

const {
  signup,
} = require("../../controllers/authentication/signup.controller");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

router.post("/", [auth, admin], signup);

module.exports = router;
