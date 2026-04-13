const mongoose = require("mongoose");

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

module.exports = mongoose.model("Destination", destinationSchema);
