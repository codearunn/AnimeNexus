const rateLimit = require("express-rate-limit");

// AI endpoints (expensive)
exports.aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI requests. Try again later."
});

// Similar anime (more expensive)
exports.similarLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many similar requests. Try again later."
});

// Auth routes (security)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later."
});

// Public endpoints (cheap)
exports.publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
});