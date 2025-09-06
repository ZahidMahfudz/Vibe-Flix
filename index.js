const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");

// Vercel expects you to export the app (as a handler function)
module.exports = app;
