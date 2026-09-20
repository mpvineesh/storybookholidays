const TeamMember = require("../models/TeamMember");

// First-run bootstrap only: the founder is added so the section has
// something to show until the admin fills in the rest of the team.
const DEFAULT_TEAM_MEMBERS = [
  {
    name: "Justin Jose",
    role: "Founder & Director",
    bio: "",
    imagePath: "",
    isActive: true,
    sortOrder: 1,
  },
];

const ensureDefaultTeamMembers = async () => {
  const existingCount = await TeamMember.estimatedDocumentCount();
  if (existingCount > 0) {
    return [];
  }

  return TeamMember.insertMany(DEFAULT_TEAM_MEMBERS);
};

module.exports = ensureDefaultTeamMembers;
