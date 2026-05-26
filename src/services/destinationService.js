const Destination = require("../models/Destination");
const seedDestinations = require("../data/destinations");
const { isDatabaseConnected } = require("../config/database");
const { normalizeSlug } = require("../utils/slug");

function sortDestinations(destinations) {
  return [...destinations].sort((left, right) => left.order - right.order);
}

function buildMapEmbedUrl(destination) {
  const location = destination.location || {};
  if (location.embedUrl) return location.embedUrl;

  const query = location.label || destination.name || destination.region || "India";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function enrichDestination(destination) {
  if (!destination) return destination;

  return {
    ...destination,
    cardImage: destination.cardImage || destination.heroImage,
    location: {
      ...(destination.location || {}),
      embedUrl: buildMapEmbedUrl(destination),
    },
  };
}

function toSearchItem(destination) {
  return {
    name: destination.name,
    slug: destination.slug,
    region: destination.region,
    url: `/destinations/${destination.slug}`,
    legacyPaths: destination.legacyPaths || [],
  };
}

async function fromDatabase() {
  if (!isDatabaseConnected()) return null;

  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log("Database is empty, auto-seeding destinations and site content...");
      const seedDestinations = require("../data/destinations");
      const siteContent = require("../data/siteContent");
      const SiteContent = require("../models/SiteContent");

      // Seed destinations
      for (const d of seedDestinations) {
        await Destination.updateOne({ slug: d.slug }, { $set: d }, { upsert: true });
      }

      // Seed site content
      for (const [key, payload] of Object.entries(siteContent)) {
        await SiteContent.updateOne({ key }, { $set: { payload } }, { upsert: true });
      }
      console.log("Auto-seeding database completed successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding database failed:", error);
  }

  const docs = await Destination.find({ publishStatus: "published" })
    .sort({ order: 1, name: 1 })
    .lean();

  return docs.length ? docs.map(enrichDestination) : null;
}

async function getPublishedDestinations() {
  const dbDestinations = await fromDatabase();
  return dbDestinations || sortDestinations(seedDestinations).map(enrichDestination);
}

async function getFeaturedDestinations(limit = 3) {
  const destinations = await getPublishedDestinations();
  return destinations.filter((destination) => destination.featured).slice(0, limit);
}

async function getDestinationBySlug(slugOrPath) {
  const normalized = normalizeSlug(slugOrPath);
  const requestPath = String(slugOrPath || "").startsWith("/")
    ? String(slugOrPath)
    : `/${slugOrPath}`;

  if (isDatabaseConnected()) {
    const dbDestination = await Destination.findOne({
      publishStatus: "published",
      $or: [{ slug: normalized }, { legacyPaths: requestPath }],
    }).lean();

    if (dbDestination) return enrichDestination(dbDestination);
  }

  return enrichDestination(seedDestinations.find((destination) => {
    return (
      destination.slug === normalized ||
      (destination.legacyPaths || []).includes(requestPath)
    );
  }));
}

async function getSearchIndex() {
  const destinations = await getPublishedDestinations();
  return destinations.map(toSearchItem);
}

async function getPublishedDestinationsPaginated(page = 1, limit) {
  const allDestinations = await getPublishedDestinations();
  const totalCount = allDestinations.length;
  const parsedLimit = Number.parseInt(limit, 10);
  const pageLimit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : Math.max(totalCount, 1);
  const parsedPage = Number.parseInt(page, 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageLimit));
  const currentPage = Math.max(1, Math.min(requestedPage, totalPages));
  const startIndex = (currentPage - 1) * pageLimit;
  const destinations = allDestinations.slice(startIndex, startIndex + pageLimit);

  return { destinations, totalPages, currentPage, totalCount };
}

async function searchDestinations(query) {
  const term = String(query || "").trim().toLowerCase();
  const destinations = await getPublishedDestinations();

  if (!term) return destinations.map(toSearchItem);

  return destinations
    .filter((destination) => {
      return [
        destination.name,
        destination.slug,
        destination.region,
        destination.summary,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    })
    .map(toSearchItem);
}

module.exports = {
  getDestinationBySlug,
  getFeaturedDestinations,
  getPublishedDestinations,
  getPublishedDestinationsPaginated,
  getSearchIndex,
  searchDestinations,
};
