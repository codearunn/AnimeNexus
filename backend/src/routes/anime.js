const express = require("express");
const router = express.Router();
const {getAllAnime,
       getAnimeById,
       searchAnime,
       getAllGenres} = require("../controllers/anime");


router.get("/", getAllAnime);
router.get("/search", searchAnime);
router.get("/genres", getAllGenres);

// Dynamic routes LAST
router.get("/:id", getAnimeById);

module.exports= router;