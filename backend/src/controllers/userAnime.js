const UserAnime = require("../models/UserAnime");
const ErrorResponse = require("../utils/errorResponse");
const {jikan, delay, transformAnime} = require("../services/jikan");

// POST /api/user-anime
const createUserAnime = async (req, res, next) => {
  try {

    const { animeId, status= "plan-to-watch", currentEpisode=0 } = req.body;
    const userId = req.user._id;

    if (!animeId) throw new ErrorResponse("Anime ID required", 400);

    // Check if already exists
    const exists = await UserAnime.findOne({ userId, animeId });

    if (exists) {
      // If it exists, return the existing entry instead of error
      // This handles the case where user tries to add the same anime again
      return res.status(200).json({
        status: true,
        message: "Already in your list",
        data: exists
      });
    }

    await delay(350);
    const response = await jikan.get(`/anime/${animeId}`);
    const anime = transformAnime(response.data.data);

    const addAnime = await UserAnime.create({
      userId,
      animeId,
      status,
      currentEpisode,

      animeCache: {
        title: anime.title.english,
        poster: anime.images.poster,
        episodes: anime.episodes,
        updatedAt: new Date()
      }
    });

    return res.status(201).json({
      status: true,
      message: "Added to your list",
      data: addAnime
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/user-anime
const getUseranime = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let query = { userId };

    if (req.query.status) query.status = req.query.status;

    const list = await UserAnime.find(query).sort({ updatedAt: -1 });

    return res.json({
      status: true,
      count: list.length,
      data: list
    });

  } catch (error) {
    next(error);
  }
};

// PUT /api/user-anime/:id
const updateUserAnime = async (req, res, next) => {
  try {
    const entryId = req.params.id;
    const updates = req.body;

    const entry = await UserAnime.findById(entryId);

    if (!entry) throw new ErrorResponse("Entry not found", 404);

    if (entry.userId.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized", 401);
    }

    if(
      updates.currentEpisode !== undefined &&
      (updates.currentEpisode < 0 ||
      updates.currentEpisode > entry.animeCache.episodes)
    ){
      throw new ErrorResponse("Invalid episode number", 400);
    }

    // Rating bounds (optional)
    if (
      updates.rating !== undefined &&
      (updates.rating < 0 || updates.rating > 10)
    ) {
      throw new ErrorResponse("Rating must be between 0 and 10", 400);
    }

    const updated = await UserAnime.findByIdAndUpdate(
      entryId,
      updates,
      { new: true } // without this mongo will return old entry
    );

    return res.json({
      status: true,
      data: updated
    });

  } catch (error) {
    next(error);
  }
};

// DELETE /api/user-anime/:id
const deleteUserAnime = async (req, res, next) => {
  try {
    const entry = await UserAnime.findById(req.params.id);

    if (!entry) throw new ErrorResponse("Entry not found", 404);

    if (entry.userId.toString() !== req.user._id.toString()) {
      throw new ErrorResponse("Not authorized", 401);
    }

    await entry.deleteOne();

    return res.json({
      status: true,
      message: "Removed from list"
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/user-anime/cleanup
// Clean up orphaned entries for current user
const cleanupUserAnime = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all user's anime entries
    const userEntries = await UserAnime.find({ userId });

    let deletedCount = 0;

    // Check each entry and delete if animeId is invalid
    for (const entry of userEntries) {
      if (!entry.animeId || !entry.animeCache) {
        await UserAnime.findByIdAndDelete(entry._id);
        deletedCount++;
      }
    }

    return res.json({
      status: true,
      message: `Cleaned up ${deletedCount} orphaned entries`,
      deletedCount
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUserAnime,
  getUseranime,
  updateUserAnime,
  deleteUserAnime,
  cleanupUserAnime,
};