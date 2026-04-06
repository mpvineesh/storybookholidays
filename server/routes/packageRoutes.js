const express = require("express");

const {
  listPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadPackageImage = require("../middleware/uploadPackageImage");

const router = express.Router();

router
  .route("/")
  .get(listPackages)
  .post(requireAdmin, uploadPackageImage.single("image"), createPackage);

router.get("/slug/:slug", getPackageBySlug);
router
  .route("/:id")
  .put(requireAdmin, uploadPackageImage.single("image"), updatePackage)
  .delete(requireAdmin, deletePackage);

module.exports = router;
