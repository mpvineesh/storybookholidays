const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");
const slugify = require("./slugify");

const HOTEL_TYPES = ["Hotel", "Resort", "Homestay", "Houseboat", "Villa"];

const mapHotelResponse = (req, hotelDocument) => {
  const hotelObject = hotelDocument.toObject ? hotelDocument.toObject() : hotelDocument;

  return {
    ...hotelObject,
    region: hotelObject.region || "Kerala",
    imageUrl: getStoredFileUrl(req, hotelObject.imagePath),
    imageFileName: getStoredFileName(hotelObject.imagePath),
    gallery: (hotelObject.gallery || []).map((entry) => ({
      imagePath: entry.imagePath,
      imageOriginalName: entry.imageOriginalName || "",
      imageUrl: getStoredFileUrl(req, entry.imagePath),
    })),
  };
};

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry).trim()).filter(Boolean);
      }
    } catch (_error) {
      // fall through to newline / comma parsing
    }
  }

  return trimmed
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const parseNumber = (value, fallback = 0) => {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseHotelInput = (body = {}) => {
  const name = (body.name || "").trim();
  const type = HOTEL_TYPES.includes(body.type) ? body.type : "Hotel";
  const starRating = Math.min(5, Math.max(0, parseNumber(body.starRating, 0)));

  return {
    name,
    slug: slugify(body.slug || name || ""),
    type,
    region: (body.region || "").trim() || "Kerala",
    location: (body.location || "").trim(),
    address: (body.address || "").trim(),
    starRating,
    shortDescription: (body.shortDescription || "").trim(),
    contentHtml: body.contentHtml || "",
    amenities: parseList(body.amenities),
    priceFrom: Math.max(0, parseNumber(body.priceFrom, 0)),
    priceNote: (body.priceNote || "").trim(),
    contactPhone: (body.contactPhone || "").trim(),
    contactEmail: (body.contactEmail || "").trim(),
    website: (body.website || "").trim(),
    mapUrl: (body.mapUrl || "").trim(),
    isActive: body.isActive === "false" ? false : body.isActive !== false,
    sortOrder: parseNumber(body.sortOrder, 0),
  };
};

// Paths of existing gallery images the admin chose to keep on update.
const parseKeptGallery = (body = {}) => parseList(body.keepGallery);

module.exports = {
  HOTEL_TYPES,
  mapHotelResponse,
  parseHotelInput,
  parseKeptGallery,
};
