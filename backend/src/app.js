require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

//Imports
const cookieParser= require("cookie-parser");
const authRoute = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

//DB connection
const connectDB = require("./config/db");
connectDB(process.env.MONGODB_URI);

//MIDDLEWARES
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth',authRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);
module.exports = app;