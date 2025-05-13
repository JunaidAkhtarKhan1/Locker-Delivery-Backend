const express = require("express");
const router = express.Router();

const {
  updateColumnDetails,
} = require("../../controllers/machineConfiguration/updateColumnDetails.controller");
const auth = require("../../middleware/auth");

router.post("/", [auth], updateColumnDetails);

module.exports = router;
