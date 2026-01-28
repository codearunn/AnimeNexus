const Anime = require("../models/Anime");
const ErrorResponse = require("../utils/errorResponse");


const getAllAnime = async (req, res, next) => {
  try {
    // ?page=2&limit=5
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Anime.countDocuments();

    // skip → ignore first N
    // limit → take next N
    const allAnimes = await Anime.find({})
      .select("title synopsis episodes status genres images rating year")
      .sort({ "rating.average": -1 }) //// Sort by rating, highest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: true,
      count: allAnimes.length,
      total: total,
      page: page,
      pages: Math.ceil(total / limit),
      data: allAnimes,
    });
  } catch (error) {
    next(error);
  }
}

const getAnimeById = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      throw new ErrorResponse("Anime not Found", 404);
    }

    return res.status(200).json({
      status: true,
      data: anime,
    })
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return next(new ErrorResponse("Invalid anime ID format", 400));
    }
    next(error);
  }
};

const searchAnime = async (req, res, next) => {
  try {


    const { q, genre, status, year, page = 1, limit = 20 } = req.query; // page=1 & limit=20 are default values

    let query = {}; //build query here

    if (q) {
      query["title.english"] = {
        $regex: q,  // regular expression match (finds all title matching ex: for nar => naruto, narina, naruto shippuden)
        $options: "i", // case-insensitive
      };
    }

    if (genre) {
      query.genres = { $in: [genre] } //Match if array contains this value. (genres: ["Action", "Fantasy"])
    }

    if (status) {
      query.status = status;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const pageNum = Math.max(parseInt(page), 1);
    const pageLimit = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * pageLimit ;
    const total = await Anime.countDocuments(query); // count all matching with query

    const Animes = await Anime.find(query)
      .select("title synopsis episode duration status genres images rating year")
      .sort({ "rating.average": -1 })
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      status: true,
      count: Animes.length,
      total: total,
      page: page,
      pages: Math.ceil(total / pageLimit),
      data: Animes,
    })
  } catch (error) {
    next(error);
  }
};
 //Get list of all available genres for dropdown
const getAllGenres = async (req, res, next) => {
  try {
    const genres = await Anime.distinct("genres");

    return res.status(200).json({
      status:true,
      count: genres.length,
      data: genres.sort(),
    })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAnime,
  getAnimeById,
  searchAnime,
  getAllGenres
}
