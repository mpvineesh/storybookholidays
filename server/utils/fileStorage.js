const fs = require("fs");
const path = require("path");

const uploadsDirectory = path.join(__dirname, "../../uploads");
const packageImagesDirectory = path.join(uploadsDirectory, "packages");
const destinationImagesDirectory = path.join(uploadsDirectory, "destinations");
const regionContentImagesDirectory = path.join(uploadsDirectory, "region-content");

fs.mkdirSync(packageImagesDirectory, { recursive: true });
fs.mkdirSync(destinationImagesDirectory, { recursive: true });
fs.mkdirSync(regionContentImagesDirectory, { recursive: true });

const removeFileIfExists = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  uploadsDirectory,
  packageImagesDirectory,
  destinationImagesDirectory,
  regionContentImagesDirectory,
  removeFileIfExists,
};
