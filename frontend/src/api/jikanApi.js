import axios from "axios";

// Central place for ALL anime fetching
// Rate limiting
// Error handling
// Data shaping
const jikan = axios.create({
  baseURL:"https://api.jikan.moe/v4",
  timeout:10000, //10s, why timeouts? => If Jikan hangs → your app freezes.10s is safe.
  headers:{
    "Content-Type": "application/json",
  }
});


//  Rate Limiting Helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// This means:
// Promise stays pending
// After ms → resolve()


// Data Transformer
const transformAnime = (anime) => ({
  _id: anime.mal_id,

  title: {
    english: anime.title_english || anime.title,
    japanese: anime.title_japanese
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
      anime.images?.jpg?.large_image_url ||
      anime.images?.jpg?.image_url
  },

  rating: {
    average: anime.score || 0,
    count: anime.scored_by || 0
  },

  studio: anime.studios?.[0]?.name
});


//Search Anime
export const searchAnime = async ({q="", page=1, limit=10}) => {
  try {
    await delay(350); // 3req/sec=~333ms between calls,so best time

    const res = await jikan.get("/anime",{
      params:{
        q,
        page,
        limit,
        order_by:"score",
        sort:"desc",
      }
    });

    return {
      data:res.data.data.map(transformAnime),
      pagination:res.data.pagination,
    };
  } catch (error) {
    console.error("Jikan searchAnime Error:", error);
    throw new Error("Failed to fetch anime");
  }
};

// Get Anime By ID
export const getAnimeById= async (id) => {
  try {
    await delay(350);
    const res = await jikan.get(`/anime/${id}`);
    return transformAnime(res.data.data);
  } catch (error) {
    console.error("Jikan getAnimeById Error:", error);
    throw new Error("Anime not Found");
  }
};

// Top Anime
export const getTopAnime = async (page=1) => {
  try {
    await delay(350);
    const res= await jikan.get("/top/anime",{
      params:{page}, //?page=<value>
    });
    return res.data.data.map(transformAnime);
  } catch (error) {
    console.error("Jikan getTopAnime Error:", error);
    throw new Error("Failed to load top anime");
  }
}

export default jikan;