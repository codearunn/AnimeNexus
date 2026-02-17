require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

//Imports
const cookieParser= require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const authRoute = require("./routes/auth");
const animeRoute = require("./routes/anime");
const userAnimeRoute = require("./routes/userAnime");
const aiRoutes = require("./routes/ai");
const adminRoutes = require("./routes/admin");

//DB connection
const connectDB = require("./config/db");
connectDB(process.env.MONGODB_URI);

//MIDDLEWARES
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


//Routes
app.use('/api/auth',authRoute);
app.use('/api/anime', animeRoute);
app.use('/api/user-anime', userAnimeRoute);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);
module.exports = app;