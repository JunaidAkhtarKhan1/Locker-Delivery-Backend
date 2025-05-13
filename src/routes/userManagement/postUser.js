const express = require("express");
const router = express.Router();

const {
  postAllUser,
} = require("../../controllers/userManagement/postUser.controller");
// const auth = require("../../../middleware/auth");

router.post("/", [], postAllUser);

module.exports = router;
