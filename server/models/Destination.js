const mongoose = require("mongoose");

const DESTINATION_REGIONS = ["Kerala", "India", "World"];

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    region: {
      type: String,
      enum: {
        values: DESTINATION_REGIONS,
        message: "Region must be one of: Kerala, India, World",
      },
      default: "Kerala",
      required: [true, "Region is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    contentHtml: {
      type: String,
      required: [true, "Destination content is required"],
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
  },
  {
    timestamps: true,
  }
);

const DestinationModel = mongoose.model("Destination", destinationSchema);
DestinationModel.REGIONS = DESTINATION_REGIONS;

module.exports = DestinationModel;
