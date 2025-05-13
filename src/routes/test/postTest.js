const express = require("express");
const router = express.Router();

const { postAllTest } = require("../../controllers/test/postTest.controller");
// const auth = require("../../../middleware/auth");

router.post("/", [], postAllTest);

module.exports = router;
