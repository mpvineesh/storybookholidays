const RegionContent = require("../models/RegionContent");
const { buildDefaultsFor } = require("../utils/regionContentDefaults");
const { removeFileIfExists } = require("../utils/fileStorage");

const isValidRegion = (region) => RegionContent.REGIONS.includes(region);

const getRegionContent = async (req, res, next) => {
  try {
    const { region } = req.params;

    if (!isValidRegion(region)) {
      return res.status(400).json({
        success: false,
        message: `Invalid region. Must be one of: ${RegionContent.REGIONS.join(", ")}`,
      });
    }

    let document = await RegionContent.findOne({ region });

    if (!document) {
      document = await RegionContent.create(buildDefaultsFor(region));
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return next(error);
  }
};

const upsertRegionContent = async (req, res, next) => {
  try {
    const { region } = req.params;

    if (!isValidRegion(region)) {
      return res.status(400).json({
        success: false,
        message: `Invalid region. Must be one of: ${RegionContent.REGIONS.join(", ")}`,
      });
    }

    const payload = { ...req.body, region };

    const document = await RegionContent.findOneAndUpdate(
      { region },
      { $set: payload },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return next(error);
  }
};

const uploadRegionContentImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const relativePath = `/uploads/region-content/${req.file.filename}`;
    const absoluteUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

    return res.status(201).json({
      success: true,
      data: {
        path: relativePath,
        url: absoluteUrl,
      },
    });
  } catch (error) {
    if (req.file) {
      await removeFileIfExists(req.file.path);
    }
    return next(error);
  }
};

module.exports = {
  getRegionContent,
  upsertRegionContent,
  uploadRegionContentImageHandler,
};
