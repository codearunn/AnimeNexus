const express = require("express");
const router = express.Router();
const {getAllAnime,
       getAnimeById,
       searchAnime,
       getAllGenres,
       getAnimeDetails} = require("../controllers/anime");
const { optionalProtect } = require("../middleware/auth");


router.get("/", getAllAnime);
router.get("/search", searchAnime);
router.get("/genres", getAllGenres);

// Dynamic routes LAST
router.get("/:id", getAnimeById);
// optionalProtect: logged-in users get userStats, guests see community stats only
router.get("/:id/details", optionalProtect, getAnimeDetails);

module.exports= router;