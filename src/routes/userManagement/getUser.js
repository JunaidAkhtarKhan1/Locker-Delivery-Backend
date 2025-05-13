const express = require("express");
const router = express.Router();

const {
  getAllUser,
} = require("../../controllers/userManagement/getUser.controller");
const auth = require("../../middleware/auth");

router.get("/", [auth], getAllUser);

module.exports = router;
