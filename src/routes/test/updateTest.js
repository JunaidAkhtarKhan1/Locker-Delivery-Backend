const express = require("express");
const router = express.Router();

const {
  updateAllTest,
} = require("../../controllers/test/updateTest.controller");
const auth = require("../../middleware/auth");

router.post("/", [auth], updateAllTest);

module.exports = router;
