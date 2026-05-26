const { connectDatabase } = require("../config/database");
const Destination = require("../models/Destination");
const SiteContent = require("../models/SiteContent");
const User = require("../models/User");
const destinations = require("../data/destinations");
const siteContent = require("../data/siteContent");
const env = require("../config/env");

async function seed() {
  if (!env.mongoUri) {
    throw new Error("MDBKEY or MONGODB_URI is required before seeding.");
  }

  await connectDatabase({ log: true });

  for (const destination of destinations) {
    await Destination.updateOne(
      { slug: destination.slug },
      { $set: destination },
      { upsert: true }
    );
  }

  for (const [key, payload] of Object.entries(siteContent)) {
    await SiteContent.updateOne({ key }, { $set: { payload } }, { upsert: true });
  }

  if (env.adminEmail && env.adminPassword) {
    if (env.adminPassword.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
    }

    const email = env.adminEmail.toLowerCase().trim();
    const existingAdmin = await User.findOne({ $or: [{ email }, { Email: email }] });

    if (existingAdmin) {
      existingAdmin.name = existingAdmin.name || "Travl Admin";
      existingAdmin.email = email;
      existingAdmin.role = "admin";
      existingAdmin.adminApproved = true;
      if (!existingAdmin.passwordHash) {
        existingAdmin.passwordHash = await User.hashPassword(env.adminPassword);
      }
      await existingAdmin.save();
    } else {
      await User.create({
        name: "Travl Admin",
        email,
        passwordHash: await User.hashPassword(env.adminPassword),
        role: "admin",
        adminApproved: true,
      });
    }
  }

  console.log(`Seeded ${destinations.length} destinations and site content.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
