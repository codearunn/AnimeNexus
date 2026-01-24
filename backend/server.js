require('dotenv').config();
const express = require("express");
const cors = require('cors');

const app = express();
const PORT= process.env.PORT||8000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());



app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));