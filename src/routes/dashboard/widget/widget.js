const express = require("express");
const router = express.Router();

const { widgets } = require("../../../controllers/dashboard/widgets/widget.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], widgets);

module.exports = router;
