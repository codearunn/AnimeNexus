const express = require("express");
const router = express.Router();
const {getAllAnime,
       getAnimeById,
       searchAnime,
       getAllGenres,
       getAnimeDetails} = require("../controllers/anime");
const protect = require("../middleware/auth");


router.get("/", getAllAnime);
router.get("/search", searchAnime);
router.get("/genres", getAllGenres);

// Dynamic routes LAST
router.get("/:id", getAnimeById);
router.get("/:id/details", protect, getAnimeDetails);

module.exports= router;