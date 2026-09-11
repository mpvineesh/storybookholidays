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

const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
  },
  { _id: false }
);

const regionContentSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    footer: {
      cta: {
        title: { type: String, default: "" },
        note: { type: String, default: "" },
      },
      brand: {
        label: { type: String, default: "" },
        heading: { type: String, default: "" },
        description: { type: String, default: "" },
      },
      explore: {
        label: { type: String, default: "" },
        heading: { type: String, default: "" },
        links: { type: [footerLinkSchema], default: [] },
      },
      themes: {
        label: { type: String, default: "" },
        heading: { type: String, default: "" },
        links: { type: [footerLinkSchema], default: [] },
      },
      service: {
        label: { type: String, default: "" },
        heading: { type: String, default: "" },
        description: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        supportPoints: { type: [String], default: [] },
      },
      bottom: {
        title: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

const RegionContent = mongoose.model("RegionContent", regionContentSchema);
RegionContent.REGIONS = REGIONS;

module.exports = RegionContent;
