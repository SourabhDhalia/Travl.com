const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", asyncHandler(authController.renderLogin));
router.get("/register", asyncHandler(authController.renderRegister));
router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.register));
router.post("/logout", authController.logout);
router.get("/logout", authController.logout);

module.exports = router;
