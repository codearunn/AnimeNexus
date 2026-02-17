const express = require("express");
const router = express.Router();
const cache = require("../services/cache");

// GET /api/admin/cache-stats
// Returns cache performance metrics
router.get("/cache-stats", (req, res) => {
  try {
    const stats = cache.stats();
    
    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        keys: Array.from(cache.store.keys()).slice(0, 10) // First 10 keys only
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch cache stats"
    });
  }
});

// POST /api/admin/cache-clear
// Clears all cache (use with caution)
router.post("/cache-clear", (req, res) => {
  try {
    cache.clear();
    
    res.status(200).json({
      success: true,
      message: "Cache cleared successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to clear cache"
    });
  }
});

module.exports = router;
