const express = require("express");
const router = express.Router();

const {
  uploadFile,
} = require("../../controllers/products/postProducts.controller");
const auth = require("../../middleware/auth");

router.post("/", [auth], uploadFile);

module.exports = router;
