const express = require("express");

const {
  listTestimonials,
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadTestimonialImage = require("../middleware/uploadTestimonialImage");

const router = express.Router();

router
  .route("/")
  .get(listTestimonials)
  .post(requireAdmin, uploadTestimonialImage.single("image"), createTestimonial);

router.get("/admin/all", requireAdmin, listAllTestimonials);

router
  .route("/:id")
  .put(requireAdmin, uploadTestimonialImage.single("image"), updateTestimonial)
  .delete(requireAdmin, deleteTestimonial);

module.exports = router;
