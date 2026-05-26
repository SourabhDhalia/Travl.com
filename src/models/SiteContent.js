const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SiteContent || mongoose.model("SiteContent", siteContentSchema);
