const express = require("express");
const router = express.Router();

const { machines } = require("../../../controllers/dashboard/filters/machines.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const staffAdmin = require("../../../middleware/staffAdmin");

router.get("/", [auth], machines);

module.exports = router;
