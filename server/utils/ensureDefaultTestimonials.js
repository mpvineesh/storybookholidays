const Testimonial = require("../models/Testimonial");
const { DEFAULT_TESTIMONIALS } = require("./testimonialDefaults");

const ensureDefaultTestimonials = async () => {
  // Seed only when the collection is empty so testimonials the admin
  // deliberately removed are never resurrected.
  const existingCount = await Testimonial.estimatedDocumentCount();
  if (existingCount > 0) {
    return [];
  }

  return Testimonial.insertMany(DEFAULT_TESTIMONIALS);
};

module.exports = ensureDefaultTestimonials;
