const Region = require("../models/Region");
const ensureDefaultRegions = require("../utils/ensureDefaultRegions");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const { mapRegionResponse, parseRegionInput } = require("../utils/regionPayload");

const createUniqueSlug = async (baseSlug, existingId = null) => {
  const slugRoot = baseSlug || `region-${Date.now()}`;
  let candidate = slugRoot;
  let counter = 1;

  while (true) {
    const existingRegion = await Region.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    });

    if (!existingRegion) {
      return candidate;
    }

    counter += 1;
    candidate = `${slugRoot}-${counter}`;
  }
};

const listRegions = async (req, res, next) => {
  try {
    await ensureDefaultRegions();

    const filter = req.includeInactiveRegions ? {} : { isActive: true };
    const regions = await Region.find(filter).sort({ sortOrder: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: regions.length,
      data: regions.map((entry) => mapRegionResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const listAdminRegions = (req, res, next) => {
  req.includeInactiveRegions = true;
  return listRegions(req, res, next);
};

const createRegion = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const regionInput = parseRegionInput(req.body);
    regionInput.slug = await createUniqueSlug(regionInput.slug);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "regions", "region");
      regionInput.imagePath = uploadedImagePath;
      regionInput.imageOriginalName = req.file.originalname;
    }

    const region = await Region.create(regionInput);

    return res.status(201).json({
      success: true,
      data: mapRegionResponse(req, region),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }
    return next(error);
  }
};

const updateRegion = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingRegion = await Region.findById(req.params.id);

    if (!existingRegion) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    const regionInput = parseRegionInput(req.body);
    regionInput.slug = await createUniqueSlug(
      regionInput.slug || existingRegion.slug,
      existingRegion._id
    );

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "regions", "region");
      regionInput.imagePath = uploadedImagePath;
      regionInput.imageOriginalName = req.file.originalname;
    }

    const updatedRegion = await Region.findByIdAndUpdate(
      req.params.id,
      regionInput,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (req.file && existingRegion.imagePath) {
      await removeStoredFile(existingRegion.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapRegionResponse(req, updatedRegion),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }
    return next(error);
  }
};

const deleteRegion = async (req, res, next) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: "Region not found",
      });
    }

    if (region.imagePath) {
      await removeStoredFile(region.imagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Region deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRegion,
  deleteRegion,
  listAdminRegions,
  listRegions,
  updateRegion,
};
