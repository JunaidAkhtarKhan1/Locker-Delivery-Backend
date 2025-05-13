const express = require("express");
const router = express.Router();

const { getAllTest } = require("../../controllers/test/getTest.controller");
// const auth = require("../../../middleware/auth");

router.get("/", [], getAllTest);

module.exports = router;
