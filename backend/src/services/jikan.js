// Your backend becomes a proxy ==> Frontend → Backend → Jikan
// Centralized API calls
// Can add caching later
// Consistent error handling
// Rate limiting in one place
const axios = require("axios");

const jikan = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 10000
});

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const transformAnime = (anime) => ({
  _id: anime.mal_id,
  malId: anime.mal_id,  // explicit numeric Jikan ID — used by frontend for animeId

  title: {
    english: anime.title_english || anime.title,
    japanese: anime.title_japanese,
  },

  synopsis: anime.synopsis,
  episodes: anime.episodes,
  year: anime.year,
  status: anime.status?.toLowerCase(),

  genres: anime.genres?.map(g => g.name) || [],

  images: {
    poster: anime.images?.jpg?.large_image_url,
    banner:
      anime.trailer?.images?.maximum_image_url ||
      anime.images?.jpg?.large_image_url
  },

  rating: {
    average: anime.score || 0,
    count: anime.scored_by || 0
  },

  studio: anime.studios?.[0]?.name
});

module.exports = { jikan, delay, transformAnime };