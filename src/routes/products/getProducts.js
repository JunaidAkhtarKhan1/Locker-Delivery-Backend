const express = require("express");
const router = express.Router();

const {
  getAllProducts,
} = require("../../controllers/products/getProducts.controller");
const auth = require("../../middleware/auth");

router.get("/", [auth], getAllProducts);

module.exports = router;
