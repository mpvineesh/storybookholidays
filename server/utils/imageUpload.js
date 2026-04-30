const multer = require("multer");

const createImageUpload = () =>
  multer({
    storage: multer.memoryStorage(),
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

module.exports = {
  createImageUpload,
};
