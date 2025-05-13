const express = require("express");
const router = express.Router();

const { liveTest2 } = require("../controllers/test2.controller");
const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

router.get("/", [], liveTest2);

module.exports = router;
