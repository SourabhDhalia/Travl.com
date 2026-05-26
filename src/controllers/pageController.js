const destinationService = require("../services/destinationService");
const siteContentService = require("../services/siteContentService");
const { getBaseViewContext } = require("./renderContext");

function loginRedirect(req) {
  return `/login?next=${encodeURIComponent(req.originalUrl || req.url || "/more")}`;
}

const statusMessages = {
  contact: "Thanks for reaching out. Your message has been received.",
  feedback: "Thanks for the feedback. It helps shape Travl.",
};

const destinationGridColumns = 4;
const destinationRowsPerPage = 2;
const defaultDestinationLimit = destinationGridColumns * destinationRowsPerPage;
const maxDestinationLimit = defaultDestinationLimit * 3;

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getDestinationLimit(requestedLimit) {
  const parsedLimit = parsePositiveInteger(requestedLimit);
  if (!parsedLimit) return defaultDestinationLimit;
  return Math.min(parsedLimit, maxDestinationLimit);
}

function getDestinationQuery(req, destinationView, limit) {
  const query = { ...req.query, layout: destinationView };
  const requestedLimit = parsePositiveInteger(req.query.limit);

  if (requestedLimit) {
    query.limit = String(limit);
  } else {
    delete query.limit;
  }

  return query;
}

async function renderHome(req, res) {
  const [home, featuredDestinations, allDestinations] = await Promise.all([
    siteContentService.getSiteContent("home"),
    destinationService.getFeaturedDestinations(3),
    destinationService.getPublishedDestinations(),
  ]);

  res.render(
    "home",
    await getBaseViewContext({
      title: "Travl.com",
      bodyClass: "page-home",
      home,
      featuredDestinations,
      allDestinations,
      statusMessage: statusMessages[req.query.status],
    })
  );
}

async function renderDestinations(req, res) {
  if (!req.session.user) {
    return res.redirect(loginRedirect(req));
  }

  const page = parsePositiveInteger(req.query.page) || 1;
  const limit = getDestinationLimit(req.query.limit);
  const destinationView = req.query.layout === "alt" ? "alt" : "grid";

  const { destinations, totalPages, currentPage, totalCount } =
    await destinationService.getPublishedDestinationsPaginated(page, limit);

  const query = getDestinationQuery(req, destinationView, limit);

  function getPageUrl(pageNum) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(query)) {
      if (key !== "page") {
        params.set(key, val);
      }
    }
    params.set("page", pageNum);
    return `/more?${params.toString()}`;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({
      number: i,
      url: getPageUrl(i),
      isCurrent: i === currentPage,
    });
  }

  res.render(
    "destinations",
    await getBaseViewContext({
      title: `Explore Destinations${currentPage > 1 ? ` — Page ${currentPage}` : ""} | Travl.com`,
      bodyClass: "page-destinations",
      destinations,
      destinationView,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        prevPageUrl: currentPage > 1 ? getPageUrl(currentPage - 1) : null,
        nextPageUrl: currentPage < totalPages ? getPageUrl(currentPage + 1) : null,
        pages,
        hasPagination: totalPages > 1,
      },
    })
  );
}

async function renderDestination(req, res, next) {
  const destination = await destinationService.getDestinationBySlug(req.params.slug);
  if (!destination) return next();

  if (!req.session.user) {
    return res.redirect(loginRedirect(req));
  }

  res.render(
    "destination",
    await getBaseViewContext({
      title: destination.seo?.title || `${destination.name} | Travl.com`,
      metaDescription: destination.seo?.description || destination.summary,
      bodyClass: "page-destination",
      destination,
      statusMessage: statusMessages[req.query.status],
    })
  );
}

async function redirectLegacyDestination(req, res, next) {
  const destination = await destinationService.getDestinationBySlug(req.path);
  if (!destination) return next();
  return res.redirect(301, `/destinations/${destination.slug}`);
}

async function renderCurrency(req, res) {
  res.render(
    "currency",
    await getBaseViewContext({
      title: "Currency Converter | Travl.com",
      bodyClass: "page-currency",
      currencyPage: true,
    })
  );
}

module.exports = {
  redirectLegacyDestination,
  renderCurrency,
  renderDestination,
  renderDestinations,
  renderHome,
};
