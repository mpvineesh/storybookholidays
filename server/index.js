const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

const app = require("./app");
const connectToDatabase = require("./config/database");
const ensureDefaultRegions = require("./utils/ensureDefaultRegions");

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectToDatabase();
    await ensureDefaultRegions();

    app.listen(PORT, () => {
      console.log(`Itinerary API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
