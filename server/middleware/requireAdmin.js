const { verifyAdminToken } = require("../utils/adminToken");

const requireAdmin = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  try {
    req.admin = verifyAdminToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid admin token",
    });
  }
};

module.exports = requireAdmin;
