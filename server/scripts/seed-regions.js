/* eslint-disable no-console */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
  override: true,
});

require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const connectToDatabase = require("../config/database");
const ensureDefaultRegions = require("../utils/ensureDefaultRegions");

const seedRegions = async () => {
  try {
    await connectToDatabase();
    const regions = await ensureDefaultRegions();
    console.log(`Seeded ${regions.length} default regions:`);
    regions.forEach((region) => {
      console.log(`- ${region.title} (${region.region})`);
    });
  } catch (error) {
    console.error("Failed to seed regions:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedRegions();
