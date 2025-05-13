const express = require("express");
const router = express.Router();

const {
  updateAllUser,
} = require("../../controllers/userManagement/updateUser.controller");
// const auth = require("../../../middleware/auth");

router.post("/", [], updateAllUser);

module.exports = router;
