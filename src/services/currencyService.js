const CurrencyRate = require("../models/CurrencyRate");
const env = require("../config/env");
const { isDatabaseConnected } = require("../config/database");

const fallbackRates = {
  USD: 1,
  INR: 83.2,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156.4,
  RUB: 88.6,
  AUD: 1.51,
  CAD: 1.37,
};

const currencyMeta = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "Rs" },
  { code: "EUR", name: "Euro", symbol: "EUR" },
  { code: "GBP", name: "British Pound", symbol: "GBP" },
  { code: "JPY", name: "Japanese Yen", symbol: "JPY" },
  { code: "RUB", name: "Russian Ruble", symbol: "RUB" },
  { code: "AUD", name: "Australian Dollar", symbol: "AUD" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CAD" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function convertBase(rates, base) {
  const baseRate = rates[base] || 1;
  return Object.fromEntries(
    Object.entries(rates).map(([code, rate]) => [code, Number((rate / baseRate).toFixed(6))])
  );
}

async function readCachedRate(base) {
  if (!isDatabaseConnected()) return null;
  return CurrencyRate.findOne({ base, date: today() }).lean();
}

async function writeCachedRate(payload) {
  if (!isDatabaseConnected()) return;
  await CurrencyRate.updateOne(
    { base: payload.base, date: payload.date },
    { $set: payload },
    { upsert: true }
  );
}

async function fetchExternalRates(base) {
  if (!env.exchangeRatesApiKey || typeof fetch !== "function") return null;

  const url = new URL("https://api.exchangeratesapi.io/v1/latest");
  url.searchParams.set("access_key", env.exchangeRatesApiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) return null;

  const payload = await response.json();
  if (!payload || !payload.rates) return null;

  const eurRates = { ...payload.rates, EUR: 1 };
  return {
    base,
    date: payload.date || today(),
    rates: convertBase(eurRates, base),
    source: "exchangeratesapi",
  };
}

async function getLatestRates(base = "USD") {
  const normalizedBase = String(base || "USD").toUpperCase();
  const cached = await readCachedRate(normalizedBase);
  if (cached) {
    return {
      base: cached.base,
      date: cached.date,
      rates: Object.fromEntries(cached.rates),
      source: cached.source,
      currencies: currencyMeta,
    };
  }

  const external = await fetchExternalRates(normalizedBase).catch(() => null);
  if (external) {
    await writeCachedRate(external);
    return { ...external, currencies: currencyMeta };
  }

  return {
    base: normalizedBase,
    date: today(),
    rates: convertBase(fallbackRates, normalizedBase),
    source: "fallback",
    currencies: currencyMeta,
  };
}

module.exports = {
  getLatestRates,
};
