const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    quote: {
      type: String,
      required: [true, "Quote is required"],
      trim: true,
    },
    // Empty string means the testimonial is shown for every region.
    region: {
      type: String,
      trim: true,
      default: "",
    },
    imagePath: {
      type: String,
      trim: true,
      default: "",
    },
    imageOriginalName: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
