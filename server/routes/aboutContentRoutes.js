const express = require("express");

const {
  getAboutContent,
  upsertAboutContent,
} = require("../controllers/aboutContentController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router
  .route("/")
  .get(getAboutContent)
  .put(requireAdmin, upsertAboutContent);

module.exports = router;
