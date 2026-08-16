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

const parseDestinationInput = (body = {}) => ({
  title: (body.title || "").trim(),
  slug: slugify(body.slug || body.title || ""),
  region: (body.region || "").trim() || "Kerala",
  shortDescription: (body.shortDescription || "").trim(),
  contentHtml: body.contentHtml || "",
});

module.exports = {
  mapDestinationResponse,
  parseDestinationInput,
};
