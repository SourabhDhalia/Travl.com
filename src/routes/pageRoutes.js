const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const pageController = require("../controllers/pageController");
const submissionController = require("../controllers/submissionController");

const router = express.Router();

router.get("/", asyncHandler(pageController.renderHome));
router.get("/log", asyncHandler(pageController.renderHome));
router.get("/more", asyncHandler(pageController.renderDestinations));
router.get("/morenext1", asyncHandler(pageController.renderDestinations));
router.get("/morenext2", asyncHandler(pageController.renderDestinations));
router.get("/morenext3", asyncHandler(pageController.renderDestinations));
router.get("/Moneyconvertor", asyncHandler(pageController.renderCurrency));
router.get("/currency", asyncHandler(pageController.renderCurrency));
router.get("/forgot", (req, res) => res.redirect("/login"));
router.get("/destinations/:slug", asyncHandler(pageController.renderDestination));

router.post("/contact", asyncHandler(submissionController.submitContact));
router.post("/feedback", asyncHandler(submissionController.submitFeedback));

router.get(
  [
    "/amerFort",
    "/elloraCaves",
    "/goldenTemple",
    "/Hampi",
    "/humayunTomb",
    "/khajuraho",
    "/padmanabhaswamyTemple",
    "/nandaDevi",
    "/tajMahal",
    "/tsongmoLake",
  ],
  asyncHandler(pageController.redirectLegacyDestination)
);

module.exports = router;
