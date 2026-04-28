const mongoose = require("mongoose");

const REGIONS = ["Kerala", "India", "World"];

const slideSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const destinationItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const experienceThemeSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const regionContentSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      enum: REGIONS,
      required: true,
      unique: true,
    },
    header: {
      tagline: { type: String, default: "" },
    },
    hero: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      badges: { type: [String], default: [] },
      slides: { type: [slideSchema], default: [] },
    },
    planning: {
      points: { type: [String], default: [] },
    },
    destinations: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [destinationItemSchema], default: [] },
    },
    packagesSection: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
    },
    experience: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      themes: { type: [experienceThemeSchema], default: [] },
    },
    stats: { type: [statSchema], default: [] },
  },
  { timestamps: true }
);

const RegionContent = mongoose.model("RegionContent", regionContentSchema);
RegionContent.REGIONS = REGIONS;

module.exports = RegionContent;
