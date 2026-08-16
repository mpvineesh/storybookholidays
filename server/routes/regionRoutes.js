const express = require("express");

const {
  createRegion,
  deleteRegion,
  listAdminRegions,
  listRegions,
  updateRegion,
} = require("../controllers/regionController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadRegionImage = require("../middleware/uploadRegionImage");

const router = express.Router();

router
  .route("/")
  .get(listRegions)
  .post(requireAdmin, uploadRegionImage.single("image"), createRegion);

router.get("/admin/all", requireAdmin, listAdminRegions);

router
  .route("/:id")
  .put(requireAdmin, uploadRegionImage.single("image"), updateRegion)
  .delete(requireAdmin, deleteRegion);

module.exports = router;
