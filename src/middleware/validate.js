const { validationResult } = require("express-validator");
const logger = require('../utils/logger');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log each error message
    errors.array().forEach(err => {
      logger.error(`Validasi Gagal : ${err.msg}`);
    });

    return res.status(400).json({
      message: "Validasi gagal",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
}

module.exports = validate;
