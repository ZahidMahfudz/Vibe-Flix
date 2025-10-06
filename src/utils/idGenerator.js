const { v4: uuidv4 } = require('uuid');

function generateUserId() {
  return `usr-${uuidv4()}`;
}

function generateRefreshTokenId() {
  return `rft-${uuidv4()}`;
}

module.exports = { generateUserId, generateRefreshTokenId };
