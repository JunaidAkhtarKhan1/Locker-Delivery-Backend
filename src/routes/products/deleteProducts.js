const express = require("express");
const router = express.Router();

const {
  deleteAllProducts,
} = require("../../controllers/products/deleteProducts.controller");
const auth = require("../../middleware/auth");

router.delete("/", [auth], deleteAllProducts);

module.exports = router;
