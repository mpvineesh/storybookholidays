const express = require("express");

const {
  listHotels,
  listAllHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotelController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadHotelImage = require("../middleware/uploadHotelImage");

const router = express.Router();

const hotelUploadFields = uploadHotelImage.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 12 },
]);

router
  .route("/")
  .get(listHotels)
  .post(requireAdmin, hotelUploadFields, createHotel);

router.get("/admin/all", requireAdmin, listAllHotels);
router.get("/slug/:slug", getHotelBySlug);
router
  .route("/:id")
  .put(requireAdmin, hotelUploadFields, updateHotel)
  .delete(requireAdmin, deleteHotel);

module.exports = router;
