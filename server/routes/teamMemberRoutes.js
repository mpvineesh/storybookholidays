const express = require("express");

const {
  listTeamMembers,
  listAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamMemberController");
const requireAdmin = require("../middleware/requireAdmin");
const uploadTeamMemberImage = require("../middleware/uploadTeamMemberImage");

const router = express.Router();

router
  .route("/")
  .get(listTeamMembers)
  .post(requireAdmin, uploadTeamMemberImage.single("image"), createTeamMember);

router.get("/admin/all", requireAdmin, listAllTeamMembers);

router
  .route("/:id")
  .put(requireAdmin, uploadTeamMemberImage.single("image"), updateTeamMember)
  .delete(requireAdmin, deleteTeamMember);

module.exports = router;
