const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: [true, "dayNumber is required"],
      min: [1, "dayNumber must be at least 1"],
    },
    title: {
      type: String,
      required: [true, "Day title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    activities: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    durationDays: {
      type: Number,
      required: [true, "durationDays is required"],
      min: [1, "durationDays must be at least 1"],
    },
    price: {
      type: Number,
      min: [0, "price cannot be negative"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    days: {
      type: [itineraryDaySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
