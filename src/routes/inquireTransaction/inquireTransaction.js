const express = require("express");
const router = express.Router();

const { inquireTransaction } = require("../../controllers/inquireTransaction/inquireTransaction.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], inquireTransaction);

module.exports = router;