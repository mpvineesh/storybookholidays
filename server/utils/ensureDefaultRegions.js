const Region = require("../models/Region");
const { DEFAULT_REGIONS } = require("./regionDefaults");

const ensureDefaultRegions = async () => {
  // Defaults are a first-run bootstrap only. Re-seeding when any region
  // exists would resurrect regions the admin deliberately deleted.
  const existingCount = await Region.estimatedDocumentCount();
  if (existingCount > 0) {
    return [];
  }

  const results = await Promise.all(
    DEFAULT_REGIONS.map(async (region) => {
      // Match on region OR slug: both carry unique indexes, so a document
      // that exists under either key must block the insert.
      const filter = {
        $or: [{ region: region.region }, { slug: region.slug }],
      };

      try {
        return await Region.findOneAndUpdate(
          filter,
          { $setOnInsert: region },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
        );
      } catch (error) {
        if (error && error.code === 11000) {
          // Lost an upsert race or hit a doc outside the filter that owns
          // one of the unique keys — the region effectively exists.
          return Region.findOne(filter);
        }
        throw error;
      }
    })
  );

  return results;
};

module.exports = ensureDefaultRegions;
