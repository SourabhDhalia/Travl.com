const mongoose = require("mongoose");

const textBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    moreUrl: { type: String, trim: true },
  },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    legacyPaths: [{ type: String, trim: true }],
    name: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true },
    cardImage: { type: String },
    region: { type: String, trim: true },
    bestTime: { type: String, trim: true },
    facts: [textBlockSchema],
    foods: [textBlockSchema],
    myths: [textBlockSchema],
    gallery: [{ type: String }],
    location: {
      label: { type: String, trim: true },
      mapUrl: { type: String, trim: true },
      embedUrl: { type: String, trim: true },
    },
    seo: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
    },
    order: { type: Number, default: 100 },
    featured: { type: Boolean, default: false },
    publishStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Destination ||
  mongoose.model("Destination", destinationSchema);
