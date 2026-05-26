const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    Email: {
      type: String,
      lowercase: true,
      trim: true,
      select: false,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["traveller", "admin"],
      default: "traveller",
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function mirrorLegacyEmail(next) {
  if (this.email) {
    this.Email = this.email;
  }
  next();
});

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
