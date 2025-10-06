const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'accesTokenVibeFlixSecret';
const accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenVibeFlixSecret';
const refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Generate token
function generateAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

// Verify token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshSecret);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
