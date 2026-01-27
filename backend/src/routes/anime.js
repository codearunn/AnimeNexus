const express = require("express");
const router = express.Router();
const {getAllAnime, getAnimeById} = require("../controllers/anime");


router.get("/", getAllAnime);
router.get("/:id", getAnimeById);

module.exports= router;