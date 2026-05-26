const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const apiController = require("../controllers/apiController");

const router = express.Router();

router.get("/search", asyncHandler(apiController.search));
router.get("/currency/latest", asyncHandler(apiController.latestCurrencyRates));
router.post("/assistant", asyncHandler(apiController.assistant));

module.exports = router;
