const { body } = require("express-validator");
const logger = require('../utils/logger');

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .custom((value)=>{logger.debug(`Melakukan validasi nama ${value}`); return true}),
  body("email")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom((value)=>{logger.debug(`Melakukan validasi email ${value}`); return true}),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .custom((value)=>{logger.debug(`Melakukan validasi password ${value}`); return true}),
  body("role")
    .optional()
    .isIn(["USER", "ADMIN"])
    .withMessage("Role hanya boleh USER atau ADMIN")
    .custom((value)=>{logger.debug(`Melakukan validasi role ${value}`); return true}),
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
