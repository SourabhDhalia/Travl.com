const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["contact", "feedback"],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
