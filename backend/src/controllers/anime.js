const UserAnime = require("../models/UserAnime");
const ErrorResponse = require("../utils/errorResponse");
const {jikan, delay, transformAnime} = require("../services/jikan");

/*
 * Genre name → Jikan ID mapping
 * (add more later)
 */
const GENRE_MAP = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Horror: 14,
  Romance: 22,
  "Sci-Fi": 24,
  Thriller: 41
};
/**
 * Frontend status → Jikan status
 */
const STATUS_MAP = {
  watching: "airing",
  completed: "complete",
  "plan-to-watch": "upcoming"
};

const getAllAnime = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20,25); // Jikan max 25

    await delay(1000);

    const response = await jikan.get("/top/anime",{
      params:{
        page,
        limit,
      }
    });
    const anime = response.data.data.map(transformAnime);

    return res.status(200).json({
      status:true,
      count:anime.length,
      pagination: response.data.pagination,
      data:anime,
    });
  } catch (error) {
    console.error("Jikan getAllAnime error:", error);

    // Handle rate limit
    if (error.response?.status === 429) {
      return next(new ErrorResponse("Too many requests. Please wait a moment and try again.", 429));
    }

    // Handle gateway timeout
    if (error.response?.status === 504) {
      return next(new ErrorResponse("Jikan API is temporarily unavailable. Please try again later.", 504));
    }

    next(error);
  }
}

const getAnimeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await delay(1000);

    const response = await jikan.get(`/anime/${id}`);
    const anime = transformAnime(response.data.data);
    return res.status(200).json({
      status:true,
      data:anime,
    })
  } catch (error) {
    console.error("Jikan getAnimeById error:", error);

    if (error.response?.status === 404) {
      return next(new ErrorResponse("Anime not found", 404));
    }

    // Handle rate limit
    if (error.response?.status === 429) {
      return next(new ErrorResponse("Too many requests. Please wait a moment and try again.", 429));
    }

    // Handle gateway timeout
    if (error.response?.status === 504) {
      return next(new ErrorResponse("Jikan API is temporarily unavailable. Please try again later.", 504));
    }

    next(error);
  }
};

const searchAnime = async (req, res, next) => {
  try {
    const { q, genre, status, year, page = 1, limit = 20 } = req.query; // page=1 & limit=20 are default values
    await delay(1000);

    const genreId = GENRE_MAP[genre];
    const jikanStatus = STATUS_MAP[status];
    const startDate= year? `${year}-01-01`: undefined;

    const response = await jikan.get("/anime",{
      params:{
        q,
        page,
        limit,
        order_by:"score",
        sort:"desc",
        genres:genreId,
        status:jikanStatus,
        start_date:startDate,
      }
    });
    const animes = response.data.data.map(transformAnime);

    return res.status(200).json({
      status:true,
      count:animes.length,
      pagination: response.data.pagination,
      data:animes,
    });
  } catch (error) {
    console.error("Jikan searchAnime error:", error);

    // Handle rate limit
    if (error.response?.status === 429) {
      return next(new ErrorResponse("Too many requests. Please wait a moment and try again.", 429));
    }
    // Handle gateway timeout
    if (error.response?.status === 504) {
      return next(new ErrorResponse("Jikan API is temporarily unavailable. Please try again later.", 504));
    }

    next(new ErrorResponse("Failed to search anime", 500));
  }
};
 //Get list of all available genres for dropdown
const getAllGenres = async (req, res, next) => {
  try {
    await delay(1000);

    const response = await jikan.get("/genres/anime");

    const genres = response.data.data.map(g => ({
      id: g.mal_id,
      name: g.name
    }));

    return res.status(200).json({
      status: true,
      count: genres.length,
      data: genres
    });

  } catch (error) {
    console.error("Get genres error:", error);

    // Handle rate limit
    if (error.response?.status === 429) {
      return next(new ErrorResponse("Too many requests. Please wait a moment and try again.", 429));
    }

    // Handle gateway timeout
    if (error.response?.status === 504) {
      return next(new ErrorResponse("Jikan API is temporarily unavailable. Please try again later.", 504));
    }

    next(error);
  }
};

const getAnimeDetails = async (req, res, next) => {
  try {
    const animeId= Number(req.params.id);

    await delay(1000);

    const response = await jikan.get(`/anime/${animeId}`);
    if(!response.data?.data){
      throw new ErrorResponse("Anime not Found", 404);
    }
    const anime = transformAnime(response.data.data);

    let usersWithThisAnime = await UserAnime.find({animeId:animeId})
    const usersWithThisAnimeCount=usersWithThisAnime.length;

    const watching =  usersWithThisAnime.filter(a => a.status==="watching").length;
    const completed =  usersWithThisAnime.filter(a => a.status==="completed").length;
    const planTowatch =  usersWithThisAnime.filter(a => a.status==="plan-to-watch").length;
    const onHold =  usersWithThisAnime.filter(a => a.status==="on-hold").length;
    const dropped =  usersWithThisAnime.filter(a => a.status==="dropped").length;


    const usersRated= usersWithThisAnime.filter(anime => anime.rating!==undefined);
    const ratedSum = usersRated.reduce((sum,anime) => sum+anime.rating,0);
    const avgUserRating= usersRated.length===0? 0 : (ratedSum/usersRated.length).toFixed(1);

    // Personal user stats (OPTIONAL)
    let userStats=null;
    if(req.user){
      const userAnime= await UserAnime.findOne({userId:req.user._id, animeId});
      if(userAnime){
        userStats={
          status:userAnime.status,
          rating:userAnime.rating,
          progress:userAnime.currentEpisode,
        };
      }
    }

    return res.status(200).json({
      status:true,
      anime: anime,
      stats:{
        totalMembers:usersWithThisAnimeCount,
        statusBreakDown:{
          watching,
          completed,
          planTowatch,
          onHold,
          dropped,
        },
        averageUserRating:avgUserRating,
        userStats,
      }
    });

  } catch (error) {
    console.error("Anime details error:", error);

    // Handle rate limit
    if (error.response?.status === 429) {
      return next(new ErrorResponse("Too many requests. Please wait a moment and try again.", 429));
    }

    // Handle gateway timeout
    if (error.response?.status === 504) {
      return next(new ErrorResponse("Jikan API is temporarily unavailable. Please try again later.", 504));
    }

    next(error);
  }
}

const getRecommendations = async (req, res, next) => {

}

module.exports = {
  getAllAnime,
  getAnimeById,
  searchAnime,
  getAllGenres,
  getAnimeDetails,
  getRecommendations
}
