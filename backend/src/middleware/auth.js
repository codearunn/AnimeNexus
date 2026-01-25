const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) =>{
  let token;

  // Option 1: Read from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if(authHeader && authHeader.startsWith("Bearer ")){
    token= authHeader.split(" ")[1];
  }

   // Option 2: Read from cookie: req.cookies.token
  if(!token && req.cookies && req.cookies.token){
      token = req.cookies.token;
  }

  // No token
  if (!token) {
    return res.status(401).json({
      status:false,
      message: "Not authorized, No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user= await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({
        status:false,
        message: "User not found"
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
}

module.exports= protect;