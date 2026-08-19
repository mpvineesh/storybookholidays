const AboutContent = require("../models/AboutContent");
const { buildAboutDefaults } = require("../utils/aboutContentDefaults");

const ABOUT_KEY = "about";

const getAboutContent = async (_req, res, next) => {
  try {
    let document = await AboutContent.findOne({ key: ABOUT_KEY });

    if (!document) {
      document = await AboutContent.create(buildAboutDefaults());
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return next(error);
  }
};

const upsertAboutContent = async (req, res, next) => {
  try {
    const payload = { ...req.body, key: ABOUT_KEY };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;

    const document = await AboutContent.findOneAndUpdate(
      { key: ABOUT_KEY },
      { $set: payload },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAboutContent,
  upsertAboutContent,
};
