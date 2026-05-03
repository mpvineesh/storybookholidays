const Destination = require("../models/Destination");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const {
  mapDestinationResponse,
  parseDestinationInput,
} = require("../utils/destinationPayload");

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
    const filter = {};
    const { region } = req.query;

    if (region && Destination.REGIONS.includes(region)) {
      filter.region = region;
    }

    const destinations = await Destination.find(filter).sort({ createdAt: -1 });

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
  let uploadedImagePath = "";

  try {
    const destinationInput = parseDestinationInput(req.body);
    destinationInput.slug = await createUniqueSlug(destinationInput.slug);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "destinations", "destination");
      destinationInput.imagePath = uploadedImagePath;
      destinationInput.imageOriginalName = req.file.originalname;
    }

    const destination = await Destination.create(destinationInput);

    return res.status(201).json({
      success: true,
      data: mapDestinationResponse(req, destination),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const updateDestination = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingDestination = await Destination.findById(req.params.id);

    if (!existingDestination) {
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
      uploadedImagePath = await uploadBufferToS3(req.file, "destinations", "destination");
      destinationInput.imagePath = uploadedImagePath;
      destinationInput.imageOriginalName = req.file.originalname;
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
      await removeStoredFile(existingDestination.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapDestinationResponse(req, updatedDestination),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
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
      await removeStoredFile(destination.imagePath);
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
