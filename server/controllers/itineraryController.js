const Itinerary = require("../models/Itinerary");

const createItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.create(req.body);

    res.status(201).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};

const getItineraries = async (_req, res, next) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries,
    });
  } catch (error) {
    next(error);
  }
};

const getItineraryById = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    return next(error);
  }
};

const updateItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createItinerary,
  getItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
};
