const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { similarLimiter, aiLimiter } = require("../middleware/rateLimiters");
const { getRecommendation, getSummary, getSimilarAnime } = require("../controllers/ai");


router.post("/recommend", protect, aiLimiter, getRecommendation);
router.post("/summary", protect, aiLimiter,  getSummary );
router.post("/similar", protect, similarLimiter, getSimilarAnime);


module.exports = router;