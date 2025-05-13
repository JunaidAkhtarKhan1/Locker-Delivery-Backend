const express = require("express");
const router = express.Router();

const {
  payfastInquire,
} = require("../../controllers/inquireTransaction/inquirePayfast.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], payfastInquire);

module.exports = router;
