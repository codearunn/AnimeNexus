const express = require("express");
const router = express.Router();
const { optionalProtect } = require("../middleware/auth");
const { similarLimiter, aiLimiter } = require("../middleware/rateLimiters");
const { getRecommendation, getSummary, getSimilarAnime } = require("../controllers/ai");


router.post("/recommend", optionalProtect, aiLimiter, getRecommendation);
router.post("/summary", optionalProtect, aiLimiter,  getSummary );
router.post("/similar", optionalProtect, similarLimiter, getSimilarAnime);


module.exports = router;