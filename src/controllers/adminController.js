const Destination = require("../models/Destination");
const Submission = require("../models/Submission");
const CurrencyRate = require("../models/CurrencyRate");
const User = require("../models/User");
const destinationService = require("../services/destinationService");
const { isDatabaseConnected } = require("../config/database");
const env = require("../config/env");
const { normalizeSlug } = require("../utils/slug");
const { getBaseViewContext } = require("./renderContext");

function compactText(value, fallback = "") {
  return String(value || fallback).trim();
}

async function renderDashboard(req, res) {
  const destinations = await destinationService.getPublishedDestinations();
  const dbConnected = isDatabaseConnected();

  const [submissionCount, latestSubmissions, cachedRates] = dbConnected
    ? await Promise.all([
        Submission.countDocuments(),
        Submission.find().sort({ createdAt: -1 }).limit(20).lean(),
        CurrencyRate.findOne().sort({ updatedAt: -1 }).lean(),
      ])
    : [0, [], null];

  const statusMessages = {
    created: "Destination created.",
    updated: "Destination updated successfully.",
    "deleted-dest": "Destination deleted successfully.",
    deleted: "Submission removed successfully.",
    "db-required": "Database connection is required for this action.",
  };

  res.render(
    "admin",
    await getBaseViewContext({
      title: "Admin Panel | Travl.com",
      bodyClass: "page-admin",
      admin: {
        dbConnected,
        destinations,
        destinationCount: destinations.length,
        submissionCount,
        latestSubmissions,
        apiStatus: {
          currencyProvider: env.exchangeRatesApiKey ? "Configured" : "Fallback mode",
          latestCurrencyCache: cachedRates
            ? `${cachedRates.base} from ${cachedRates.date}`
            : "No cache yet",
        },
      },
      statusMessage: statusMessages[req.query.status] || null,
    })
  );
}

async function renderEditPage(req, res) {
  const dbConnected = isDatabaseConnected();
  if (!dbConnected) {
    return res.redirect("/admin?status=db-required");
  }

  const { id } = req.params;
  const isNew = !id;

  let destination = {};
  let galleryString = "";
  let factsJson = "[]";
  let foodsJson = "[]";
  let mythsJson = "[]";

  if (!isNew) {
    destination = await Destination.findById(id).lean();
    if (!destination) {
      return res.status(404).render("error", {
        title: "Not Found",
        message: "Destination not found",
      });
    }
    galleryString = (destination.gallery || []).join(", ");
    factsJson = JSON.stringify(destination.facts || [], null, 2);
    foodsJson = JSON.stringify(destination.foods || [], null, 2);
    mythsJson = JSON.stringify(destination.myths || [], null, 2);
  } else {
    // Default placeholder structures
    factsJson = JSON.stringify([
      { title: "Fact Title", body: "Description of the fact...", moreUrl: "https://en.wikipedia.org/wiki/" }
    ], null, 2);
    foodsJson = JSON.stringify([
      { title: "Food Title", body: "Description of the food...", moreUrl: "https://en.wikipedia.org/wiki/" }
    ], null, 2);
    mythsJson = JSON.stringify([
      { title: "Myth Title", body: "Description of the myth...", moreUrl: "https://en.wikipedia.org/wiki/" }
    ], null, 2);
  }

  res.render(
    "admin-edit",
    await getBaseViewContext({
      title: isNew ? "Add Destination | Travl.com" : `Edit ${destination.name} | Travl.com`,
      bodyClass: "page-admin",
      isNew,
      destination,
      galleryString,
      factsJson,
      foodsJson,
      mythsJson,
    })
  );
}

async function saveDestination(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  const { id } = req.params;
  const isNew = !id;

  const name = compactText(req.body.name);
  const slug = normalizeSlug(req.body.slug || name);
  const summary = compactText(req.body.summary);
  const heroImage = compactText(req.body.heroImage);
  const cardImage = compactText(req.body.cardImage) || heroImage;
  const region = compactText(req.body.region, "India");
  const bestTime = compactText(req.body.bestTime, "October to March");
  const order = Number(req.body.order || 100);
  const featured = req.body.featured === "on" || req.body.featured === true;
  const publishStatus = compactText(req.body.publishStatus, "published");

  const location = {
    label: compactText(req.body.locationLabel) || name,
    mapUrl: compactText(req.body.mapUrl) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`,
    embedUrl: compactText(req.body.embedUrl) || "",
  };

  const seo = {
    title: `${name} | Travl.com`,
    description: summary,
  };

  const gallery = String(req.body.gallery || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let facts = [];
  let foods = [];
  let myths = [];
  try {
    facts = JSON.parse(req.body.facts || "[]");
    foods = JSON.parse(req.body.foods || "[]");
    myths = JSON.parse(req.body.myths || "[]");
  } catch (error) {
    return res.status(422).render(
      "admin-edit",
      await getBaseViewContext({
        title: isNew ? "Add Destination" : "Edit Destination",
        bodyClass: "page-admin",
        isNew,
        errorMessage: `Invalid JSON syntax in Facts, Foods, or Myths: ${error.message}`,
        destination: { _id: id, name, slug, summary, heroImage, cardImage, region, bestTime, order, featured, publishStatus, location },
        galleryString: req.body.gallery,
        factsJson: req.body.facts,
        foodsJson: req.body.foods,
        mythsJson: req.body.myths,
      })
    );
  }

  const payload = {
    slug,
    name,
    summary,
    heroImage,
    cardImage,
    region,
    bestTime,
    order,
    featured,
    publishStatus,
    location,
    seo,
    gallery: gallery.length ? gallery : [heroImage],
    facts,
    foods,
    myths,
  };

  if (isNew) {
    await Destination.create(payload);
    return res.redirect("/admin?status=created");
  } else {
    await Destination.findByIdAndUpdate(id, { $set: payload });
    return res.redirect("/admin?status=updated");
  }
}

async function deleteDestination(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  return res.redirect("/admin?status=deleted-dest");
}

async function deleteSubmission(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  const { id } = req.params;
  await Submission.deleteOne({ _id: id });
  return res.redirect("/admin?status=deleted");
}

async function renderApprovalPage(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  if (req.session.user.email !== "admin@admin.com") {
    return res.status(403).render("error", {
      title: "Access Denied | Travl.com",
      message: "Only the main administrator (admin@admin.com) can access this page.",
    });
  }

  const pendingAdmins = await User.find({ role: "admin", adminApproved: false }).lean();

  res.render(
    "admin-approval",
    await getBaseViewContext({
      title: "Admin Approvals | Travl.com",
      bodyClass: "page-admin",
      pendingAdmins,
      statusMessage: req.query.status === "approved" ? "Admin approved successfully." : req.query.status === "rejected" ? "Admin rejected." : null,
    })
  );
}

async function approveAdmin(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  if (req.session.user.email !== "admin@admin.com") {
    return res.status(403).send("Forbidden");
  }

  const { id } = req.params;
  await User.findByIdAndUpdate(id, { $set: { adminApproved: true } });

  res.redirect("/admin/approval?status=approved");
}

async function rejectAdmin(req, res) {
  if (!isDatabaseConnected()) {
    return res.redirect("/admin?status=db-required");
  }

  if (req.session.user.email !== "admin@admin.com") {
    return res.status(403).send("Forbidden");
  }

  const { id } = req.params;
  await User.findByIdAndDelete(id);

  res.redirect("/admin/approval?status=rejected");
}

module.exports = {
  deleteDestination,
  deleteSubmission,
  renderDashboard,
  renderEditPage,
  saveDestination,
  renderApprovalPage,
  approveAdmin,
  rejectAdmin,
};
