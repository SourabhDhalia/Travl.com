const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/database");

async function start() {
  await connectDatabase({ log: true });

  app.listen(env.port, () => {
    console.log(`Travl.com server listening on port ${env.port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start Travl.com", error.message);
    process.exit(1);
  });
}

module.exports = start;
