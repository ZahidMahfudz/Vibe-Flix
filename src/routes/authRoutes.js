const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const { loginValidator, registerValidator } = require("../validator/authValidator");
const validate = require("../middleware/validate");

// Auth
router.post("/login", loginValidator, validate, authController.login);
router.post("/register", registerValidator, validate, authController.register);

// Protected route (hanya user login)
router.get("/profile", authenticateToken, authorizeRole(["USER"]), (req, res) => {
  res.json({ message: "Profile user", user: req.user });
});

// Protected route khusus ADMIN
router.get("/admin", authenticateToken, authorizeRole(["ADMIN"]), (req, res) => {
  res.json({ message: "Halo Admin!", user: req.user });
});

module.exports = router;
