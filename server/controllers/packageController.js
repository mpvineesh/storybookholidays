const Package = require("../models/Package");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const { mapPackageResponse, parsePackageInput } = require("../utils/packagePayload");

const createUniqueSlug = async (baseSlug, existingId = null) => {
  const slugRoot = baseSlug || `package-${Date.now()}`;
  let candidate = slugRoot;
  let counter = 1;

  while (true) {
    const existingPackage = await Package.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    });

    if (!existingPackage) {
      return candidate;
    }

    counter += 1;
    candidate = `${slugRoot}-${counter}`;
  }
};

const listPackages = async (req, res, next) => {
  try {
    const filter = {};
    const { region } = req.query;

    if (region && Package.REGIONS.includes(region)) {
      filter.region = region;
    }

    const packages = await Package.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: packages.length,
      data: packages.map((entry) => mapPackageResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const getPackageBySlug = async (req, res, next) => {
  try {
    const packageEntry = await Package.findOne({ slug: req.params.slug });

    if (!packageEntry) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapPackageResponse(req, packageEntry),
    });
  } catch (error) {
    return next(error);
  }
};

const createPackage = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const packageInput = parsePackageInput(req.body);
    packageInput.slug = await createUniqueSlug(packageInput.slug);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "packages", "package");
      packageInput.imagePath = uploadedImagePath;
      packageInput.imageOriginalName = req.file.originalname;
    }

    const packageEntry = await Package.create(packageInput);

    return res.status(201).json({
      success: true,
      data: mapPackageResponse(req, packageEntry),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const updatePackage = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingPackage = await Package.findById(req.params.id);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    const packageInput = parsePackageInput(req.body);
    packageInput.slug = await createUniqueSlug(
      packageInput.slug || existingPackage.slug,
      existingPackage._id
    );

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "packages", "package");
      packageInput.imagePath = uploadedImagePath;
      packageInput.imageOriginalName = req.file.originalname;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      packageInput,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (req.file && existingPackage.imagePath) {
      await removeStoredFile(existingPackage.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapPackageResponse(req, updatedPackage),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const packageEntry = await Package.findByIdAndDelete(req.params.id);

    if (!packageEntry) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (packageEntry.imagePath) {
      await removeStoredFile(packageEntry.imagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
};
