const express = require('express'); //menginisialisasi express
// const {logger} = require('./utils/logger'); //mengimpor logger
const {requestLogger} = require('./middleware/loggerMiddleware');

const app = express(); //mengisialisasi app
app.use(express.json()); //menggunakan middleware untuk parsing JSON
app.use(express.urlencoded({ extended: true })); //menggunakan middleware untuk parsing URL-encoded


// Import routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

//routes 
app.use("/users", userRoutes); 
app.use("/auth", authRoutes);

app.get('/', requestLogger,   (req, res) => {
  res.send('hello Vibe-Flix!');
});


module.exports = app; //mengekspor app untuk digunakan di file lain