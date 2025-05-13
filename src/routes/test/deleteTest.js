const express = require("express");
const router = express.Router();

const {
  deleteAllTest,
} = require("../../controllers/test/deleteTest.controller");
const auth = require("../../middleware/auth");

router.post("/", [auth], deleteAllTest);

module.exports = router;
