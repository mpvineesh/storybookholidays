const { createAdminToken } = require("../utils/adminToken");

const loginAdmin = async (req, res) => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  const { username, password } = req.body || {};

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      message: "Admin login is not configured on the server",
    });
  }

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  return res.status(200).json({
    success: true,
    token: createAdminToken(username),
    user: {
      username,
    },
  });
};

const getSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      username: req.admin.username,
    },
  });
};

module.exports = {
  loginAdmin,
  getSession,
};
