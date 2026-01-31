const UserAnime = require("../models/UserAnime");
const Anime = require("../models/Anime");
const ErrorResponse = require("../utils/errorResponse");

const createUserAnime = async (req, res, next) => {
  try {
    const {animeId, status, currentEpisode} = req.body;
    const userId = req.user._id;

    const validAnime = await Anime.findById(animeId);
    if(!validAnime){
      throw new ErrorResponse("Anime not found", 404);
    }
    const animeExistsinList = await UserAnime.findOne({userId, animeId});
    if(animeExistsinList){
      throw new ErrorResponse("Already exists in you List", 409);
    }

    const addAnime = await UserAnime.create({
      userId,
      animeId,
      status,
      currentEpisode,
    });
    // Populate replaces referenced ObjectIds with actual documents so frontend receives complete related data in one API call.
    await addAnime.populate("animeId",'title images episodes');

    return res.status(201).json({
      status:true,
      data:addAnime,
    })

  } catch (error) {
    next(error);
  }
};

const getUseranime = async (req, res, next) => {
  try {
    const userId= req.user._id;

    const {status} = req.query;

    let query={userId};
    if(status){
      query.status= status;
    }
    const userAnime = await UserAnime.find(query)
                        .populate("animeId")
                        .sort({updatedAt:-1}); //most recently updated first

    return res.status(200).json({
      status:true,
      count: userAnime.length,
      data:userAnime,
    })

  } catch (error) {
    next(error);
  }
};

const updateUserAnime= async (req, res, next) => {
  try {
    const entryId= req.params.id; // the _id of the UserAnime document
    const updates = req.body;

    const entry = await UserAnime.findById(entryId);
    if(!entry) throw new ErrorResponse("Entry not found", 404);

    // checking Ownership
    if(entry.userId.toString()!== req.user._id.toString()){
      throw new ErrorResponse("Not Authorized", 401);
    }

    await entry.populate("animeId");

    // when currentEpisode is actually provided, allowing partial updates without breaking logic.
    if(updates.currentEpisode!==undefined && updates.currentEpisode> entry.animeId.episodes
    ){
      throw new ErrorResponse("Episode exceeds total episodes", 400);
    }

    const updatedEntry= await UserAnime.findByIdAndUpdate(
      entryId,
      updates,
      {new:true} // Without: Mongo returns OLD document && With:Mongo returns UPDATED document.Frontend needs updated.
    ).populate("animeId", "title images episodes");
    return res.status(200).json({
      status:true,
      data: updatedEntry,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserAnime= async (req, res, next) => {
  try {
    const entryId= req.params.id;

    const entry= await UserAnime.findById(entryId);
    if(!entry) throw new ErrorResponse("Entry not Found", 404);

    if(entry.userId.toString()!==req.user._id.toString()){
      throw new ErrorResponse("Not Authorized!", 401);
    }

    await UserAnime.findByIdAndDelete(entryId);

    return res.status(200).json({ //204 = Deleted successfully (no content) but by using this you won't see json message so use 200
      status:true,
      message: "Removed from list",
    });

  } catch (error) {
    next(error);
  }
}

module.exports= {
  createUserAnime,
  getUseranime,
  updateUserAnime,
  deleteUserAnime
}