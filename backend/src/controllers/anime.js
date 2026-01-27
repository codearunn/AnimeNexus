const Anime = require("../models/anime");
const ErrorResponse = require("../utils/errorResponse");


const getAllAnime = async (req, res, next) => {
  try {
    // ?page=2&limit=5
    const page= parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page-1)* limit;

    const total = await Anime.countDocuments();

    // skip → ignore first N
    // limit → take next N
    const allAnimes = await Anime.find({})
            .select("title synopsis episodes status genres images rating year")
            .sort({"rating.average":-1}) //// Sort by rating, highest first
            .skip(skip)
            .limit(limit);

    res.status(200).json({
      status:true,
      count:allAnimes.length,
      total:total,
      page:page,
      pages: Math.ceil(total/limit),
      data:allAnimes,
    });
  } catch (error) {
    next(error);
  }
}

const getAnimeById = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if(!anime){
      throw new ErrorResponse("Anime not Found", 404);
    }

    return res.status(200).json({
      status:true,
      data: anime,
    })
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return next(new ErrorResponse("Invalid anime ID format", 400));
    }
    next(error);
  }
}

module.exports = {
  getAllAnime,
  getAnimeById
}
