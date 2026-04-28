const multer = require("multer");
const path = require("path");

const { regionContentImagesDirectory } = require("../utils/fileStorage");

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, regionContentImagesDirectory);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName || "region"}${extension}`
    );
  },
});

const uploadRegionContentImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }

    return callback(new Error("Only image uploads are allowed"));
  },
});

module.exports = uploadRegionContentImage;
