require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const sessionSecret =
  process.env.SESSION_SECRET ||
  (isProduction ? "" : "travl-local-development-secret");

if (isProduction && !sessionSecret) {
  throw new Error("SESSION_SECRET is required in production.");
}

module.exports = {
  isProduction,
  isTest,
  mongoUri: process.env.MDBKEY || process.env.MONGODB_URI || "",
  port: Number(process.env.PORT || 3000),
  sessionSecret,
  exchangeRatesApiKey: process.env.EXCHANGE_RATES_API_KEY || "",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
};
