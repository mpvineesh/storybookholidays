const express = require("express");

const {
  createItinerary,
  getItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
} = require("../controllers/itineraryController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.route("/").post(requireAdmin, createItinerary).get(getItineraries);
router
  .route("/:id")
  .get(getItineraryById)
  .put(requireAdmin, updateItinerary)
  .delete(requireAdmin, deleteItinerary);

module.exports = router;
