const mongoose = require("mongoose");

const HOTEL_TYPES = ["Hotel", "Resort", "Homestay", "Houseboat", "Villa"];
const HOTEL_REGIONS = ["Kerala", "India", "World"];

const galleryImageSchema = new mongoose.Schema(
  {
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
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    type: {
      type: String,
      enum: HOTEL_TYPES,
      default: "Hotel",
    },
    region: {
      type: String,
      trim: true,
      default: "Kerala",
      required: [true, "Region is required"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    starRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    contentHtml: {
      type: String,
      default: "",
    },
    amenities: {
      type: [String],
      default: [],
    },
    priceFrom: {
      type: Number,
      min: 0,
      default: 0,
    },
    priceNote: {
      type: String,
      trim: true,
      default: "",
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    mapUrl: {
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
    gallery: {
      type: [galleryImageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const HotelModel = mongoose.model("Hotel", hotelSchema);
HotelModel.TYPES = HOTEL_TYPES;
HotelModel.REGIONS = HOTEL_REGIONS;

module.exports = HotelModel;
