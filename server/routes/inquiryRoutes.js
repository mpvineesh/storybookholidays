const express = require("express");

const {
  createInquiry,
  listInquiries,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiryController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router
  .route("/")
  .get(requireAdmin, listInquiries)
  .post(createInquiry);

router
  .route("/:id")
  .patch(requireAdmin, updateInquiry)
  .delete(requireAdmin, deleteInquiry);

module.exports = router;
