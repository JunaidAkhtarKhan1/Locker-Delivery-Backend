const express = require("express");
const router = express.Router();

const { urlQR } = require("../../controllers/urlQR/urlQR.controller");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const staffAdmin = require("../../middleware/staffAdmin");

router.get("/:id", urlQR);

module.exports = router;
