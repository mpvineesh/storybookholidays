const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
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
    author: {
      type: String,
      trim: true,
      default: "Story Book Holidays",
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    contentHtml: {
      type: String,
      required: [true, "Blog content is required"],
      default: "",
    },
    tags: {
      type: [String],
      default: [],
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

module.exports = mongoose.model("Blog", blogSchema);
