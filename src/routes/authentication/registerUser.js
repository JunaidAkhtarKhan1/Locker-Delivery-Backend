const express = require("express");
const router = express.Router();

const {
  registerUser,
} = require("../../controllers/authentication/registerUser.controller");
const auth = require("../../middleware/auth");
// const admin = require("../../middleware/admin");

router.post("/", [auth], registerUser);

module.exports = router;
