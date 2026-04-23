const path = require("path");

const Package = require("../models/Package");
const slugify = require("./slugify");

const buildPackageImageUrl = (req, imagePath) => {
  if (!imagePath) {
    return "";
  }

  return `${req.protocol}://${req.get("host")}${imagePath}`;
};

const mapPackageResponse = (req, packageDocument) => {
  const packageObject = packageDocument.toObject
    ? packageDocument.toObject()
    : packageDocument;

  return {
    ...packageObject,
    imageUrl: buildPackageImageUrl(req, packageObject.imagePath),
    imageFileName: packageObject.imagePath
      ? path.basename(packageObject.imagePath)
      : "",
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
