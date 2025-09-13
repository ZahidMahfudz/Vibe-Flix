const logger = require("./src/utils/logger");
const { connectDB } = require("./src/config/db");

const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.dev" });
}

logger.info(`Environment: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}`);
logger.info(`Using config file: ${process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev"}`);
connectDB();

const app = require("./src/app");


// Vercel expects you to export the app (as a handler function)
module.exports = app;
