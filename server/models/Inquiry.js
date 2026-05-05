const mongoose = require("mongoose");

const INQUIRY_REGIONS = ["Kerala", "India", "World"];
const INQUIRY_STATUSES = ["new", "contacted", "closed"];
const ACCOMMODATION_TYPES = [
  "Budget",
  "Standard",
  "Premium",
  "Luxury",
  "Resort",
  "Homestay",
  "Houseboat",
];

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [160, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: [120, "Email is too long"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      maxlength: [40, "Phone number is too long"],
    },
    arrivalDate: {
      type: Date,
      default: null,
    },
    numberOfNights: {
      type: Number,
      required: [true, "Number of nights is required"],
      min: [1, "Number of nights must be at least 1"],
      max: [99, "Number of nights must be at most 99"],
    },
    accommodationType: {
      type: String,
      trim: true,
      default: "",
      enum: {
        values: ["", ...ACCOMMODATION_TYPES],
        message: "Accommodation type is not valid",
      },
    },
    isHoneymoon: {
      type: Boolean,
      default: false,
    },
    region: {
      type: String,
      enum: {
        values: INQUIRY_REGIONS,
        message: "Region must be one of: Kerala, India, World",
      },
      default: "Kerala",
    },
    status: {
      type: String,
      enum: {
        values: INQUIRY_STATUSES,
        message: "Status must be one of: new, contacted, closed",
      },
      default: "new",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Notes are too long"],
    },
  },
  {
    timestamps: true,
  }
);

const InquiryModel = mongoose.model("Inquiry", inquirySchema);
InquiryModel.REGIONS = INQUIRY_REGIONS;
InquiryModel.STATUSES = INQUIRY_STATUSES;
InquiryModel.ACCOMMODATION_TYPES = ACCOMMODATION_TYPES;

module.exports = InquiryModel;
