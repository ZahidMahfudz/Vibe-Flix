const express = require('express'); //menginisialisasi express

const app = express(); //mengisialisasi app
app.use(express.json()); //menggunakan middleware untuk parsing JSON

// Import routes
const userRoutes = require("./routes/userRoutes");

//routes
app.use("/users", userRoutes); //menggunakan userRoutes untuk rute /users

app.get('/', (req, res) => {
  res.send('hello Vibe-Flix!');
});


module.exports = app; //mengekspor app untuk digunakan di file lain