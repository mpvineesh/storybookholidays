const express = require("express");

const {
  getRegionContent,
  upsertRegionContent,
  uploadRegionContentImageHandler,
} = require("../controllers/regionContentController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadRegionContentImage = require("../middleware/uploadRegionContentImage");

const router = express.Router();

router.post(
  "/upload-image",
  requireAdmin,
  uploadRegionContentImage.single("image"),
  uploadRegionContentImageHandler
);

router
  .route("/:region")
  .get(getRegionContent)
  .put(requireAdmin, upsertRegionContent);

module.exports = router;
