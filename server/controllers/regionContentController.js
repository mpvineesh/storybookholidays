const RegionContent = require("../models/RegionContent");
const { buildDefaultsFor } = require("../utils/regionContentDefaults");
const {
  getStoredFileUrl,
  removeStoredFile,
  uploadBufferToS3,
} = require("../utils/objectStorage");

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
  let uploadedImagePath = "";

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    uploadedImagePath = await uploadBufferToS3(req.file, "region-content", "region");

    return res.status(201).json({
      success: true,
      data: {
        path: uploadedImagePath,
        url: getStoredFileUrl(req, uploadedImagePath),
      },
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }
    return next(error);
  }
};

module.exports = {
  getRegionContent,
  upsertRegionContent,
  uploadRegionContentImageHandler,
};
