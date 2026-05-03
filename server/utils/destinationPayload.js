const Destination = require("../models/Destination");
const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");
const slugify = require("./slugify");

const mapDestinationResponse = (req, destinationDocument) => {
  const destinationObject = destinationDocument.toObject
    ? destinationDocument.toObject()
    : destinationDocument;

  return {
    ...destinationObject,
    region: destinationObject.region || "Kerala",
    imageUrl: getStoredFileUrl(req, destinationObject.imagePath),
    imageFileName: getStoredFileName(destinationObject.imagePath),
  };
};

const normalizeRegion = (value) => {
  if (!value) {
    return "Kerala";
  }

  return Destination.REGIONS.includes(value) ? value : "Kerala";
};

const parseDestinationInput = (body = {}) => ({
  title: (body.title || "").trim(),
  slug: slugify(body.slug || body.title || ""),
  region: normalizeRegion(body.region),
  shortDescription: (body.shortDescription || "").trim(),
  contentHtml: body.contentHtml || "",
});

module.exports = {
  mapDestinationResponse,
  parseDestinationInput,
};
