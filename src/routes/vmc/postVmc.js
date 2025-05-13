const express = require("express");
const router = express.Router();

const { postVMC } = require("../../controllers/vmc/postVmc.controller");
const auth = require("../../middleware/auth");
const machine = require("../../middleware/machine");

router.post("/", [auth, machine], postVMC);

module.exports = router;
