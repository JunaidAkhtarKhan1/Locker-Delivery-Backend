const express = require("express");
const router = express.Router();
// const validator = require('express-joi-validation').createValidator({})
// const { querySchema } = require('../../models/login.model');

const { login } = require("../../controllers/authentication/login.controller");

// router.post("/", validator.body(querySchema), login);
router.post("/", login);

module.exports = router;
