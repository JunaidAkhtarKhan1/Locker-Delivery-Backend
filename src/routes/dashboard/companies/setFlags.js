const express = require("express");
const router = express.Router();

const { setFlags } = require("../../../controllers/dashboard/companies/setFlags.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], setFlags);

module.exports = router;
