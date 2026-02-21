const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
        createUserAnime,
        getUseranime,
        updateUserAnime,
        deleteUserAnime,
        cleanupUserAnime,
      } = require("../controllers/userAnime");

router.post("/", protect, createUserAnime);
router.get("/", protect, getUseranime);
router.post("/cleanup", protect, cleanupUserAnime);

router.put("/:id", protect, updateUserAnime);
router.delete("/:id", protect, deleteUserAnime);

module.exports = router;