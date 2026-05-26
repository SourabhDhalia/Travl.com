const mongoose = require("mongoose");

const currencyRateSchema = new mongoose.Schema(
  {
    base: { type: String, required: true, uppercase: true, index: true },
    date: { type: String, required: true },
    rates: { type: Map, of: Number, required: true },
    source: { type: String, default: "fallback" },
  },
  { timestamps: true }
);

currencyRateSchema.index({ base: 1, date: 1 }, { unique: true });

module.exports =
  mongoose.models.CurrencyRate ||
  mongoose.model("CurrencyRate", currencyRateSchema);
