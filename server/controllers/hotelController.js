const Hotel = require("../models/Hotel");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const {
  mapHotelResponse,
  parseHotelInput,
  parseKeptGallery,
} = require("../utils/hotelPayload");

const createUniqueSlug = async (baseSlug, existingId = null) => {
  const slugRoot = baseSlug || `hotel-${Date.now()}`;
  let candidate = slugRoot;
  let counter = 1;

  while (true) {
    const existingHotel = await Hotel.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    });

    if (!existingHotel) {
      return candidate;
    }

    counter += 1;
    candidate = `${slugRoot}-${counter}`;
  }
};

const getUploadedFiles = (req, field) =>
  (req.files && Array.isArray(req.files[field]) ? req.files[field] : []);

const uploadGalleryFiles = async (files) => {
  const uploaded = [];
  for (const file of files) {
    const imagePath = await uploadBufferToS3(file, "hotels", "hotel");
    uploaded.push({ imagePath, imageOriginalName: file.originalname });
  }
  return uploaded;
};

const removePaths = async (paths) => {
  for (const imagePath of paths.filter(Boolean)) {
    await removeStoredFile(imagePath);
  }
};

const listHotels = async (req, res, next) => {
  try {
    const filter = {};
    const { region, type, includeInactive } = req.query;

    if (region) {
      filter.region = region.trim();
    }

    if (type) {
      filter.type = type.trim();
    }

    if (includeInactive !== "true") {
      filter.isActive = { $ne: false };
    }

    const hotels = await Hotel.find(filter).sort({ sortOrder: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels.map((entry) => mapHotelResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const listAllHotels = async (req, res, next) => {
  req.query.includeInactive = "true";
  return listHotels(req, res, next);
};

const getHotelBySlug = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapHotelResponse(req, hotel),
    });
  } catch (error) {
    return next(error);
  }
};

const createHotel = async (req, res, next) => {
  const uploadedPaths = [];

  try {
    const hotelInput = parseHotelInput(req.body);
    hotelInput.slug = await createUniqueSlug(hotelInput.slug);

    const [coverFile] = getUploadedFiles(req, "image");
    if (coverFile) {
      const imagePath = await uploadBufferToS3(coverFile, "hotels", "hotel");
      uploadedPaths.push(imagePath);
      hotelInput.imagePath = imagePath;
      hotelInput.imageOriginalName = coverFile.originalname;
    }

    const galleryEntries = await uploadGalleryFiles(getUploadedFiles(req, "gallery"));
    galleryEntries.forEach((entry) => uploadedPaths.push(entry.imagePath));
    hotelInput.gallery = galleryEntries;

    const hotel = await Hotel.create(hotelInput);

    return res.status(201).json({
      success: true,
      data: mapHotelResponse(req, hotel),
    });
  } catch (error) {
    await removePaths(uploadedPaths);
    return next(error);
  }
};

const updateHotel = async (req, res, next) => {
  const uploadedPaths = [];

  try {
    const existingHotel = await Hotel.findById(req.params.id);

    if (!existingHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const hotelInput = parseHotelInput(req.body);
    hotelInput.slug = await createUniqueSlug(
      hotelInput.slug || existingHotel.slug,
      existingHotel._id
    );

    const [coverFile] = getUploadedFiles(req, "image");
    if (coverFile) {
      const imagePath = await uploadBufferToS3(coverFile, "hotels", "hotel");
      uploadedPaths.push(imagePath);
      hotelInput.imagePath = imagePath;
      hotelInput.imageOriginalName = coverFile.originalname;
    }

    const keptPaths = new Set(parseKeptGallery(req.body));
    const existingGallery = existingHotel.gallery || [];
    const keptGallery = existingGallery.filter((entry) => keptPaths.has(entry.imagePath));
    const removedGallery = existingGallery.filter((entry) => !keptPaths.has(entry.imagePath));

    const newGallery = await uploadGalleryFiles(getUploadedFiles(req, "gallery"));
    newGallery.forEach((entry) => uploadedPaths.push(entry.imagePath));

    hotelInput.gallery = [
      ...keptGallery.map((entry) => ({
        imagePath: entry.imagePath,
        imageOriginalName: entry.imageOriginalName || "",
      })),
      ...newGallery,
    ];

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, hotelInput, {
      returnDocument: "after",
      runValidators: true,
    });

    if (coverFile && existingHotel.imagePath) {
      await removeStoredFile(existingHotel.imagePath);
    }

    await removePaths(removedGallery.map((entry) => entry.imagePath));

    return res.status(200).json({
      success: true,
      data: mapHotelResponse(req, updatedHotel),
    });
  } catch (error) {
    await removePaths(uploadedPaths);
    return next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    await removePaths([
      hotel.imagePath,
      ...(hotel.gallery || []).map((entry) => entry.imagePath),
    ]);

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listHotels,
  listAllHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
};
