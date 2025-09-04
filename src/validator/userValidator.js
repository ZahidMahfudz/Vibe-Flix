const { body } = require("express-validator");

const userValidator = [
  body("email")
    .isEmail()
    .withMessage("Email tidak valid"),
  body("name")
    . notEmpty()
    .withMessage("Name wajib diisi"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

module.exports = {userValidator};