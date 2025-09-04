const { body } = require("express-validator");

const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("Email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("role")
    .optional()
    .isIn(["USER", "ADMIN"])
    .withMessage("Role hanya boleh USER atau ADMIN"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Email tidak valid"),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi"),
];

module.exports = { registerValidator, loginValidator };
