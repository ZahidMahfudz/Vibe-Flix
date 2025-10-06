// const jwt = require("jsonwebtoken");
const {verifyAccessToken, verifyRefreshToken} = require('../utils/jwt')
const logger = require('../utils/logger')
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateAccessToken(req, res, next) {
  try {
    logger.debug("Memasuki middleware authenticateAccessToken");
    // Ambil token dari header Authorization atau cookie
    const authHeader = req.headers["authorization"];
    const accessToken = req.cookies.accessToken || (authHeader && authHeader.split(" ")[1]);

    logger.debug(`Access token yang diterima: ${accessToken}`);

    if (!accessToken) {
      logger.warn("Access token tidak ditemukan");
      return res.status(401).json({ message: "Access token tidak ditemukan" });
    }

    // Verifikasi token
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

    logger.debug(`User terautentikasi: ${decoded.email} (ID: ${decoded.id_user}, ROLE : ${decoded.role})`);
    next();
  } catch (error) {
    logger.warn(`Access token tidak valid: ${error.message}`);
    return res.status(403).json({ message: "Access token tidak valid atau kadaluarsa" });
  }
}

async function authenticateRefreshToken(req, res, next) {
  try {
    logger.debug(`memasuki middleware authenticateRefreshToken`)
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      logger.warn("Refresh token tidak ditemukan");
      return res.status(401).json({ message: "Refresh token tidak ditemukan" });
    }

    logger.debug(`refresh token yang didapat : ${refreshToken}`)

    // Verifikasi token refresh
    const decoded = verifyRefreshToken(refreshToken);
    req.user = decoded;

    logger.debug(`Refresh token valid untuk user ID: ${decoded.id_user}`);
    next();
  } catch (error) {
    logger.warn(`Refresh token tidak valid: ${error.message}`);
    return res.status(403).json({ message: "Refresh token tidak valid atau kadaluarsa" });
  }
}

/*
 * Middleware untuk otorisasi berdasarkan role
 * @param {...string} allowedRoles - daftar role yang diizinkan
 * Contoh penggunaan: authorizeRole('manager', 'owner')
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        logger.warn("User belum terautentikasi saat mencoba akses role tertentu");
        return res.status(401).json({ message: "User belum terautentikasi" });
      }

      const userRole = req.user.role.toLowerCase();
      if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
        logger.warn(`User role "${userRole}" tidak diizinkan mengakses endpoint ini`);
        return res.status(403).json({ message: "Akses ditolak: tidak memiliki izin" });
      }

      logger.debug(`User role "${userRole}" diizinkan mengakses`);
      next();
    } catch (error) {
      logger.error(`Gagal melakukan otorisasi role: ${error.message}`);
      return res.status(500).json({ message: "Terjadi kesalahan saat memproses role" });
    }
  };
}

module.exports = { authenticateAccessToken, authenticateRefreshToken, authorizeRole };
