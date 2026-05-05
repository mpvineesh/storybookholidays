const Inquiry = require("../models/Inquiry");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "yes" || normalized === "1";
  }
  return false;
};

const parseArrivalDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const ddmmyyyy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      const parsed = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const parseInquiryInput = (body = {}) => ({
  name: typeof body.name === "string" ? body.name.trim() : "",
  email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
  phone: typeof body.phone === "string" ? body.phone.trim() : "",
  arrivalDate: parseArrivalDate(body.arrivalDate),
  numberOfNights: Number.parseInt(body.numberOfNights, 10),
  accommodationType:
    typeof body.accommodationType === "string"
      ? body.accommodationType.trim()
      : "",
  isHoneymoon: parseBoolean(body.isHoneymoon),
  region: Inquiry.REGIONS.includes(body.region) ? body.region : "Kerala",
});

const createInquiry = async (req, res, next) => {
  try {
    const inquiryInput = parseInquiryInput(req.body);
    const inquiry = await Inquiry.create(inquiryInput);

    return res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    return next(error);
  }
};

const listInquiries = async (req, res, next) => {
  try {
    const filter = {};
    const { region, status, search } = req.query;

    if (region && Inquiry.REGIONS.includes(region)) {
      filter.region = region;
    }

    if (status && Inquiry.STATUSES.includes(status)) {
      filter.status = status;
    }

    if (typeof search === "string" && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    return next(error);
  }
};

const updateInquiry = async (req, res, next) => {
  try {
    const update = {};

    if (typeof req.body.status === "string") {
      if (!Inquiry.STATUSES.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be one of: new, contacted, closed",
        });
      }
      update.status = req.body.status;
    }

    if (typeof req.body.notes === "string") {
      update.notes = req.body.notes.trim();
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, update, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createInquiry,
  listInquiries,
  updateInquiry,
  deleteInquiry,
};
