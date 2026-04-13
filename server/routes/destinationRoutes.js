const express = require("express");

const {
  listDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadDestinationImage = require("../middleware/uploadDestinationImage");

const router = express.Router();

router
  .route("/")
  .get(listDestinations)
  .post(requireAdmin, uploadDestinationImage.single("image"), createDestination);

router.get("/slug/:slug", getDestinationBySlug);
router
  .route("/:id")
  .put(requireAdmin, uploadDestinationImage.single("image"), updateDestination)
  .delete(requireAdmin, deleteDestination);

module.exports = router;
