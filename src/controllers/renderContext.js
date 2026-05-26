const destinationService = require("../services/destinationService");

async function getBaseViewContext(extra = {}) {
  return {
    destinationsForSearch: await destinationService.getSearchIndex(),
    ...extra,
  };
}

module.exports = {
  getBaseViewContext,
};
