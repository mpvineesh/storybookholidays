const express = require("express");

const { loginAdmin, getSession } = require("../controllers/adminController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/session", requireAdmin, getSession);

module.exports = router;
