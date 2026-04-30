const Package = require("../models/Package");
const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");
const slugify = require("./slugify");

const mapPackageResponse = (req, packageDocument) => {
  const packageObject = packageDocument.toObject
    ? packageDocument.toObject()
    : packageDocument;

  return {
    ...packageObject,
    imageUrl: getStoredFileUrl(req, packageObject.imagePath),
    imageFileName: getStoredFileName(packageObject.imagePath),
  };
};

const parsePackageInput = (body = {}) => {
  const submittedRegion = (body.region || "").trim();
  const region = Package.REGIONS.includes(submittedRegion) ? submittedRegion : "Kerala";

  return {
    title: (body.title || "").trim(),
    slug: slugify(body.slug || body.title || ""),
    region,
    duration: (body.duration || "").trim(),
    shortDescription: (body.shortDescription || "").trim(),
    contentHtml: body.contentHtml || "",
  };
};

module.exports = {
  mapPackageResponse,
  parsePackageInput,
};
