const { v4: uuidv4 } = require("uuid");

function generateUserId() {
  return `usr-${uuidv4()}`;
}

module.exports = { generateUserId };
