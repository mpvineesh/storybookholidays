const path = require("path");

const Destination = require("../models/Destination");
const { removeFileIfExists, uploadsDirectory } = require("../utils/fileStorage");
const {
  mapDestinationResponse,
  parseDestinationInput,
} = require("../utils/destinationPayload");

const getRelativeImagePath = (file) =>
  file ? `/uploads/destinations/${file.filename}` : "";

const getAbsoluteImagePath = (imagePath) =>
  imagePath ? path.join(uploadsDirectory, imagePath.replace(/^\/uploads\//, "")) : "";

const createUniqueSlug = async (baseSlug, existingId = null) => {
  const slugRoot = baseSlug || `destination-${Date.now()}`;
  let candidate = slugRoot;
  let counter = 1;

  while (true) {
    const existingDestination = await Destination.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    });

    if (!existingDestination) {
      return candidate;
    }

    counter += 1;
    candidate = `${slugRoot}-${counter}`;
  }
};

const listDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations.map((entry) => mapDestinationResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const getDestinationBySlug = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapDestinationResponse(req, destination),
    });
  } catch (error) {
    return next(error);
  }
};

const createDestination = async (req, res, next) => {
  try {
    const destinationInput = parseDestinationInput(req.body);
    destinationInput.slug = await createUniqueSlug(destinationInput.slug);

    if (req.file) {
      destinationInput.imagePath = getRelativeImagePath(req.file);
      destinationInput.imageOriginalName = req.file.originalname;
    }

    const destination = await Destination.create(destinationInput);

    return res.status(201).json({
      success: true,
      data: mapDestinationResponse(req, destination),
    });
  } catch (error) {
    if (req.file) {
      await removeFileIfExists(req.file.path);
    }

    return next(error);
  }
};

const updateDestination = async (req, res, next) => {
  try {
    const existingDestination = await Destination.findById(req.params.id);

    if (!existingDestination) {
      if (req.file) {
        await removeFileIfExists(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const destinationInput = parseDestinationInput(req.body);
    destinationInput.slug = await createUniqueSlug(
      destinationInput.slug || existingDestination.slug,
      existingDestination._id
    );

    if (req.file) {
      destinationInput.imagePath = getRelativeImagePath(req.file);
      destinationInput.imageOriginalName = req.file.originalname;
    } else {
      destinationInput.imagePath = existingDestination.imagePath;
      destinationInput.imageOriginalName = existingDestination.imageOriginalName;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      destinationInput,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (req.file && existingDestination.imagePath) {
      await removeFileIfExists(getAbsoluteImagePath(existingDestination.imagePath));
    }

    return res.status(200).json({
      success: true,
      data: mapDestinationResponse(req, updatedDestination),
    });
  } catch (error) {
    if (req.file) {
      await removeFileIfExists(req.file.path);
    }

    return next(error);
  }
};

const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    if (destination.imagePath) {
      await removeFileIfExists(getAbsoluteImagePath(destination.imagePath));
    }

    return res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
};
