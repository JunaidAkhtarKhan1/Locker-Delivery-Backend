const express = require("express");
const router = express.Router();

const {
  deleteAllUser,
} = require("../../controllers/userManagement/deleteUser.controller");
// const auth = require("../../../middleware/auth");

router.post("/", [], deleteAllUser);

module.exports = router;
