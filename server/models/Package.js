const mongoose = require("mongoose");

const PACKAGE_REGIONS = ["Kerala", "India", "World"];

const packageSchema = new mongoose.Schema(
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
        values: PACKAGE_REGIONS,
        message: "Region must be one of: Kerala, India, World",
      },
      default: "Kerala",
      required: [true, "Region is required"],
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    contentHtml: {
      type: String,
      required: [true, "Package content is required"],
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

const PackageModel = mongoose.model("Package", packageSchema);
PackageModel.REGIONS = PACKAGE_REGIONS;

module.exports = PackageModel;
