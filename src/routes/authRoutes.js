const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authenticate = require("../middleware/authMiddleware")
const validator = require("../validator/authValidator");
const validate = require("../middleware/validate");
const logger = require('../middleware/loggerMiddleware');

// Auth
router.post("/login", logger.requestLogger , validator.loginValidator, validate, authController.login);
router.post("/register", logger.requestLogger, validator.registerValidator, validate, authController.register);

// Protected route (hanya user login)
router.get("/profile", authenticate.authenticateToken, authenticate.authorizeRole(["USER"]), (req, res) => {
  res.json({ message: "Profile user", user: req.user });
});

// Protected route khusus ADMIN
router.get("/admin", authenticate.authenticateToken, authenticate.authorizeRole(["ADMIN"]), (req, res) => {
  res.json({ message: "Halo Admin!", user: req.user });
});

module.exports = router;
