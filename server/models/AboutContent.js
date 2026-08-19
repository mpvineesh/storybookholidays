const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const glanceItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const missionCardSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
  },
  { _id: false }
);

const whyBookCardSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const aboutContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "about",
    },
    hero: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      lead: { type: String, default: "" },
      backgroundImageUrl: { type: String, default: "" },
      stats: { type: [statSchema], default: [] },
    },
    story: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      paragraphs: { type: [String], default: [] },
      signatureName: { type: String, default: "" },
      signatureRole: { type: String, default: "" },
      glanceKicker: { type: String, default: "" },
      glance: { type: [glanceItemSchema], default: [] },
    },
    mission: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      cards: { type: [missionCardSchema], default: [] },
    },
    whyBook: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      cards: { type: [whyBookCardSchema], default: [] },
    },
    services: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      items: { type: [String], default: [] },
    },
    guarantee: {
      kicker: { type: String, default: "" },
      title: { type: String, default: "" },
      body: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutContent", aboutContentSchema);
