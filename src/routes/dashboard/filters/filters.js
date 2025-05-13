const express = require("express");
const router = express.Router();

const { filters } = require("../../../controllers/dashboard/filters/filters.controller");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const staffAdmin = require("../../../middleware/staffAdmin");

router.get("/", [auth], filters);

module.exports = router;
