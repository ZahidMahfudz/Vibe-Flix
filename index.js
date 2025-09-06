//index.js adalah titik masuk utama aplikasi
//mengatur server express dan memulai server

const dotenv = require("dotenv"); //env variable
dotenv.config(); //load env variable dari .env file

const app = require("./src/app"); //import app dari src/app.js

// Start the server

const port = process.env.PORT || 3000;

