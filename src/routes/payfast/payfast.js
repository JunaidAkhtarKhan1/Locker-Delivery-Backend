const express = require("express");
const router = express.Router();

const { getPayfast } = require("../../controllers/payfast/payfast.controller");
// const auth = require("../../middleware/auth");
// const machine = require("../../middleware/machine");

router.post("/", getPayfast);

module.exports = router;
