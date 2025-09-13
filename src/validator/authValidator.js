const { body } = require("express-validator");
const logger = require('../utils/logger');

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nama wajib diisi"),
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
    .withMessage("Email tidak valid")
    .custom((value)=>{logger.debug(`Melakukan validasi email ${value}`); return true}),
  body("password")
    .notEmpty()
    .withMessage("Password wajib diisi")
    .custom((value)=>{logger.debug(`Melakukan validasi password ${value}`); return true}),
];

module.exports = { registerValidator, loginValidator };
