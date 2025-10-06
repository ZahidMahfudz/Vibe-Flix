const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authenticate = require("../middleware/authMiddleware")
const validator = require("../validator/authValidator");
const validate = require("../middleware/validate");
const logger = require('../middleware/loggerMiddleware'); //dipakai untuk logging request hanya untuk pada file ini saja

// Auth
router.post("/register", logger.requestLogger, validator.registerValidator, validate, authController.register);
router.post("/login", logger.requestLogger , validator.loginValidator, validate, authController.login);
router.post("/logout", logger.requestLogger, authenticate.authenticateAccessToken, authController.logout)
router.post("/refresh-token", logger.requestLogger, authenticate.authenticateRefreshToken, authController.refreshToken)

// Protected route (hanya user login)
router.get("/profile", authenticate.authenticateAccessToken, authenticate.authorizeRole("USER"), (req, res) => {
  res.json({ message: "Profile user", user: req.user });
});

// Protected route khusus ADMIN
router.get("/admin", authenticate.authenticateAccessToken, authenticate.authorizeRole("ADMIN"), (req, res) => {
  res.json({ message: "Halo Admin!", user: req.user });
});

module.exports = router;
