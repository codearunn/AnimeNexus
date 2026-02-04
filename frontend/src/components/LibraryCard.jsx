import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Rating from "../components/Rating";

function LibraryCard({ anime, onUpdate }) {
  // Safety check: if animeId is null, don't render the card
  if (!anime.animeId) {
    console.error("LibraryCard: animeId is null for anime:", anime._id);
    return null;
  }

  const current = anime.currentEpisode;
  const total = anime.animeCache.episodes;

  const progress = Math.round((current / total) * 100);

  const handleUpdate = async (newEpisode) => {
    try {
      await api.put(`/user-anime/${anime._id}`, {
        currentEpisode: newEpisode,
      });

      onUpdate();
    } catch (error) {
      console.log("Error in handleUpdate", error);
      toast.error("Failed to update episode");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this anime?")) return;
    try {
      await api.delete(`/user-anime/${anime._id}`);
      toast.success("Removed from library");
      onUpdate();
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Unable to remove anime");
    }
  };

  const handleRating = async (newRating) => {
    try {
      await api.put(`/user-anime/${anime._id}`, {rating: newRating});
      onUpdate();
      toast.success("Rating saved");
    } catch (error) {
      toast.error("Failed to Rate");
      console.log("Error in handleRating", error);
    }
  }

  return (
    <div className="bg-gray-950 rounded-xl overflow-hidden shadow-lg hover:shadow-red-600/40 transition-all duration-300 group">

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/anime/${anime.animeId}`}>
          <img
            src={anime.animeCache.poster}
            alt={anime.animeCache.title.english}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Rating */}
        {anime.rating && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            ⭐ {anime.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Title */}
        <h3 className="text-white font-bold text-2xl line-clamp-2 border-b border-red-900 group-hover:text-red-500 transition">
          {anime.animeCache.title.english}
        </h3>

        {/* Episode info */}
        <p className="text-sm text-gray-400 text-center">
          Episode {current} / {total}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-red-500 text-right">{progress}%</p>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            disabled={current === 0}
            onClick={() => handleUpdate(current - 1)}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 disabled:opacity-40"
          >
            −
          </button>

          <button
            disabled={current >= total}
            onClick={() => handleUpdate(current + 1)}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 disabled:opacity-40"
          >
            +
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-black font-extrabold text-3xl rounded-lg py-1"
          >
            ✕
          </button>
        </div>
        <Rating
           currentRating={anime.rating}
           onChangeRating={(newRating) => handleRating(newRating)}
           className="flex justify-center items-center"
          />
      </div>
    </div>
  );
}

export default LibraryCard;