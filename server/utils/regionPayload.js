const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");
const slugify = require("./slugify");

const mapRegionResponse = (req, regionDocument) => {
  const regionObject = regionDocument.toObject
    ? regionDocument.toObject()
    : regionDocument;

  return {
    ...regionObject,
    imageUrl: getStoredFileUrl(req, regionObject.imagePath),
    imageFileName: getStoredFileName(regionObject.imagePath),
  };
};

const parseRegionInput = (body = {}) => {
  const title = (body.title || "").trim();
  const region = (body.region || title).trim();

  return {
    title,
    region,
    slug: slugify(body.slug || region || title || ""),
    tagline: (body.tagline || "").trim(),
    description: (body.description || "").trim(),
    isActive: body.isActive === "false" ? false : body.isActive !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
};

module.exports = {
  mapRegionResponse,
  parseRegionInput,
};
