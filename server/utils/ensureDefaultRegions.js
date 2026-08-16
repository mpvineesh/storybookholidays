const Region = require("../models/Region");
const { DEFAULT_REGIONS } = require("./regionDefaults");

const ensureDefaultRegions = async () => {
  const results = await Promise.all(
    DEFAULT_REGIONS.map((region) =>
      Region.findOneAndUpdate(
        { region: region.region },
        { $setOnInsert: region },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )
    )
  );

  return results;
};

module.exports = ensureDefaultRegions;
