const { getStoredFileName, getStoredFileUrl } = require("./objectStorage");

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const parseSortOrder = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const mapTeamMemberResponse = (req, teamMemberDocument) => {
  const teamMemberObject = teamMemberDocument.toObject
    ? teamMemberDocument.toObject()
    : teamMemberDocument;

  return {
    ...teamMemberObject,
    imageUrl: getStoredFileUrl(req, teamMemberObject.imagePath),
    imageFileName: getStoredFileName(teamMemberObject.imagePath),
  };
};

const parseTeamMemberInput = (body = {}) => ({
  name: (body.name || "").trim(),
  role: (body.role || "").trim(),
  bio: (body.bio || "").trim(),
  isActive: parseBoolean(body.isActive, true),
  sortOrder: parseSortOrder(body.sortOrder),
});

module.exports = {
  mapTeamMemberResponse,
  parseTeamMemberInput,
};
