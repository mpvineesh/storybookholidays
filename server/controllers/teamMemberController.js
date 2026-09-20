const TeamMember = require("../models/TeamMember");
const { removeStoredFile, uploadBufferToS3 } = require("../utils/objectStorage");
const {
  mapTeamMemberResponse,
  parseTeamMemberInput,
} = require("../utils/teamMemberPayload");

const listSort = { sortOrder: 1, createdAt: 1 };

const listTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort(listSort);

    return res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers.map((entry) => mapTeamMemberResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const listAllTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find().sort(listSort);

    return res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers.map((entry) => mapTeamMemberResponse(req, entry)),
    });
  } catch (error) {
    return next(error);
  }
};

const createTeamMember = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const teamMemberInput = parseTeamMemberInput(req.body);

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "team", "team-member");
      teamMemberInput.imagePath = uploadedImagePath;
      teamMemberInput.imageOriginalName = req.file.originalname;
    }

    const teamMember = await TeamMember.create(teamMemberInput);

    return res.status(201).json({
      success: true,
      data: mapTeamMemberResponse(req, teamMember),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const updateTeamMember = async (req, res, next) => {
  let uploadedImagePath = "";

  try {
    const existingTeamMember = await TeamMember.findById(req.params.id);

    if (!existingTeamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    const teamMemberInput = parseTeamMemberInput(req.body);
    const shouldRemoveImage =
      !req.file && String(req.body.removeImage).toLowerCase() === "true";

    if (req.file) {
      uploadedImagePath = await uploadBufferToS3(req.file, "team", "team-member");
      teamMemberInput.imagePath = uploadedImagePath;
      teamMemberInput.imageOriginalName = req.file.originalname;
    } else if (shouldRemoveImage) {
      teamMemberInput.imagePath = "";
      teamMemberInput.imageOriginalName = "";
    }

    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      teamMemberInput,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if ((req.file || shouldRemoveImage) && existingTeamMember.imagePath) {
      await removeStoredFile(existingTeamMember.imagePath);
    }

    return res.status(200).json({
      success: true,
      data: mapTeamMemberResponse(req, updatedTeamMember),
    });
  } catch (error) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath);
    }

    return next(error);
  }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    if (teamMember.imagePath) {
      await removeStoredFile(teamMember.imagePath);
    }

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTeamMembers,
  listAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
