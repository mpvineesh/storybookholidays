const path = require("path");

const slugify = require("./slugify");

const buildDestinationImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return "";
  }

  return `${req.protocol}://${req.get("host")}${imagePath}`;
};

const mapDestinationResponse = (req, destinationDocument) => {
  const destinationObject = destinationDocument.toObject
    ? destinationDocument.toObject()
    : destinationDocument;

  return {
    ...destinationObject,
    imageUrl: buildDestinationImageUrl(req, destinationObject.imagePath),
    imageFileName: destinationObject.imagePath
      ? path.basename(destinationObject.imagePath)
      : "",
  };
};

const parseDestinationInput = (body = {}) => ({
  title: (body.title || "").trim(),
  slug: slugify(body.slug || body.title || ""),
  shortDescription: (body.shortDescription || "").trim(),
  contentHtml: body.contentHtml || "",
});

module.exports = {
  mapDestinationResponse,
  parseDestinationInput,
};
