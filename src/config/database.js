const mongoose = require("mongoose");
const env = require("./env");

let connectionPromise = null;
let loggedMissingUri = false;

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

async function connectDatabase(options = {}) {
  if (!env.mongoUri) {
    if (options.log && !loggedMissingUri) {
      console.warn("MongoDB is not configured; using seed content fallback.");
      loggedMissingUri = true;
    }
    return null;
  }

  if (isDatabaseConnected()) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 3000,
      })
      .then(() => {
        if (options.log) console.log("MongoDB connection established.");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        if (options.log) {
          console.warn(`MongoDB connection failed: ${error.message}`);
        }
        return null;
      });
  }

  return connectionPromise;
}

module.exports = {
  connectDatabase,
  isDatabaseConnected,
};
