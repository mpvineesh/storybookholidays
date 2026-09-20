const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const parseSortOrder = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const mapTestimonialResponse = (req, testimonialDocument) => {
  const testimonialObject = testimonialDocument.toObject
    ? testimonialDocument.toObject()
    : testimonialDocument;

  return {
    ...testimonialObject,
    region: testimonialObject.region || "",
    imageUrl: getStoredFileUrl(req, testimonialObject.imagePath),
    imageFileName: getStoredFileName(testimonialObject.imagePath),
  };
};

const parseTestimonialInput = (body = {}) => ({
  name: (body.name || "").trim(),
  role: (body.role || "").trim(),
  quote: (body.quote || "").trim(),
  region: (body.region || "").trim(),
  isActive: parseBoolean(body.isActive, true),
  sortOrder: parseSortOrder(body.sortOrder),
});

module.exports = {
  mapTestimonialResponse,
  parseTestimonialInput,
};
