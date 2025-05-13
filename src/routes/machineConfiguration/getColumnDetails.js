const express = require("express");
const router = express.Router();

const {
  getAllColumnDetails,
} = require("../../controllers/machineConfiguration/getColumnDetails.controller");
const auth = require("../../middleware/auth");
// const superAdmin = require("../../../middleware/superAdmin");

router.get("/", [auth], getAllColumnDetails);

module.exports = router;
