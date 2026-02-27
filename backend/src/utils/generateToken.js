const jwt = require("jsonwebtoken");

// #9 Fail fast — never silently sign with "undefined" as the secret
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set! Check your .env file.");
}

const secret = process.env.JWT_SECRET;

function generateToken(userId) {
  const payload={
    id:userId,
  };
  return jwt.sign(payload, secret, {expiresIn:"7d"});
}


module.exports= generateToken;