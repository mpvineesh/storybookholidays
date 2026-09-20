const Testimonial = require("../models/Testimonial");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const {
  mapTestimonialResponse,
  parseTestimonialInput,
} = require("../utils/testimonialPayload");

const listSort = { sortOrder: 1, createdAt: -1 };

const listTestimonials = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    const region = (req.query.region || "").trim();

    if (region) {
      // Region-specific entries plus the ones marked for every region.
      filter.region = { $in: [region, ""] };
    }

    const testimonials = await Testimonial.find(filter).sort(listSort);

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials.map((entry) => mapTestimonialResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const listAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort(listSort);

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials.map((entry) => mapTestimonialResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const testimonialInput = parseTestimonialInput(req.body);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "testimonials", "testimonial");
      testimonialInput.imagePath = uploadedImagePath;
      testimonialInput.imageOriginalName = req.file.originalname;
    }

    const testimonial = await Testimonial.create(testimonialInput);

    return res.status(201).json({
      success: true,
      data: mapTestimonialResponse(req, testimonial),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingTestimonial = await Testimonial.findById(req.params.id);

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const testimonialInput = parseTestimonialInput(req.body);
    const shouldRemoveImage =
      !req.file && String(req.body.removeImage).toLowerCase() === "true";

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "testimonials", "testimonial");
      testimonialInput.imagePath = uploadedImagePath;
      testimonialInput.imageOriginalName = req.file.originalname;
    } else if (shouldRemoveImage) {
      testimonialInput.imagePath = "";
      testimonialInput.imageOriginalName = "";
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      testimonialInput,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if ((req.file || shouldRemoveImage) && existingTestimonial.imagePath) {
      await removeStoredFile(existingTestimonial.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapTestimonialResponse(req, updatedTestimonial),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (testimonial.imagePath) {
      await removeStoredFile(testimonial.imagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTestimonials,
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
