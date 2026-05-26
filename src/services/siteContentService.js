const SiteContent = require("../models/SiteContent");
const fallbackContent = require("../data/siteContent");
const { isDatabaseConnected } = require("../config/database");

async function getSiteContent(key) {
  if (isDatabaseConnected()) {
    const doc = await SiteContent.findOne({ key }).lean();
    if (doc) return doc.payload;
  }

  return fallbackContent[key];
}

module.exports = {
  getSiteContent,
};
