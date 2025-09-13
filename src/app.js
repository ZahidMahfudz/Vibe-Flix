const express = require('express'); //menginisialisasi express
const logger = require('./utils/logger'); //mengimpor logger

const app = express(); //mengisialisasi app
app.use(express.json()); //menggunakan middleware untuk parsing JSON

// Import routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

//routes 
app.use("/users", userRoutes); //menggunakan userRoutes untuk rute /users

// Routes login
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  logger.info(`Request ke '${req.url}' dengan method : ${req.method}`); //log setiap request ke homepage
  res.send('hello Vibe-Flix!');
});


module.exports = app; //mengekspor app untuk digunakan di file lain