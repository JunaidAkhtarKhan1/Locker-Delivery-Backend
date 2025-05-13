const express = require("express");
const router = express.Router();

const { displayFlags } = require("../../../controllers/dashboard/companies/displayFlags.controller");
const auth = require("../../../middleware/auth");

router.post("/", [auth], displayFlags);

module.exports = router;
