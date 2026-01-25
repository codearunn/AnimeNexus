const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function generateToken(userId) {
  const payload={
    id:userId,
  };
  return jwt.sign(payload, secret, {expiresIn:"7d"});
}


module.exports= generateToken;