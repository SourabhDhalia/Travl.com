const currencyService = require("../services/currencyService");
const destinationService = require("../services/destinationService");
const assistantService = require("../services/assistantService");

async function search(req, res) {
  const results = await destinationService.searchDestinations(req.query.q);
  res.json({ results });
}

async function latestCurrencyRates(req, res) {
  const payload = await currencyService.getLatestRates(req.query.base || "USD");
  res.json(payload);
}

async function assistant(req, res) {
  const payload = await assistantService.answer(req.body.message);
  res.json(payload);
}

module.exports = {
  assistant,
  latestCurrencyRates,
  search,
};
