import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const STATUSES = [
  "watching",
  "completed",
  "plan-to-watch",
  "on-hold",
  "dropped",
]
function AnimeCard({ anime }) {

  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleAddToList = async (status) => {
    try {
      // #1 Use anime.malId (numeric Jikan ID), NOT anime._id (MongoDB ObjectId)
      const response = await api.post("/user-anime", {
        animeId: anime.malId,
        status: status,
        currentEpisode: 0,
      });

      // Handle both new addition and already exists
      if (response.data.message === "Already in your list") {
        toast.success("Already in your list!");
      } else {
        toast.success("Added to list!");
      }
      setOpen(false);
    } catch (error) {
      // If it's a 409 conflict, show friendly message
      if (error.response?.status === 409) {
        toast.error("Already in your list");
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error?.message || "Failed to add");
      }
    }
  }

  const handleModalClick = (e) => {
    // Prevent clicks inside modal from closing it
    e.stopPropagation();
  }

  const handleBackdropClick = () => {
    setOpen(false);
  }

  return (
    <div
      className="group block bg-black rounded-lg overflow-hidden
      hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300
      transform hover:-translate-y-2"
    >

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/anime/${anime._id}`}>
          <img
            src={anime.images.poster}
            alt={anime.title.english}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
          ⭐ {anime.rating.average.toFixed(1)}
        </div>

        {/* Status */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs uppercase">
          {anime.status}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col h-full">

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
          {anime.title.english}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-3">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
            >
              {genre}
            </span>
          ))}
          {/* Episodes & Year */}
          <div className="flex justify-between text-sm text-gray-400 mt-auto">
            <span className="p-2">{anime.episodes} Episodes</span>
            <span className="p-2">{anime.year}</span>
          </div>
        </div>
        {user && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              className="w-full bg-red-800/70 hover:bg-red-700 active:bg-red-600 text-white
                         py-2 sm:py-1 rounded-2xl font-bold transition shadow-md hover:shadow-red-900 touch-manipulation"
            >
              Add to List
            </button>
            {/* MODAL */}
            {open && (
              <div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
                onClick={handleBackdropClick}
              >
                <div 
                  className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-sm border border-gray-700 shadow-2xl"
                  onClick={handleModalClick}
                >
                  <h2 className="text-white text-base sm:text-lg font-bold mb-4 text-center">
                    Add to your list
                  </h2>

                  <div className="space-y-2">
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToList(status);
                        }}
                        className="w-full py-3 bg-gray-800 hover:bg-red-600 active:bg-red-700
                             text-white rounded-lg transition capitalize font-semibold text-sm sm:text-base
                             touch-manipulation"
                      >
                        {status.replace("-", " ")}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                    }}
                    className="mt-4 w-full py-3 text-gray-400 hover:text-white border border-gray-700 
                               rounded-lg transition font-semibold text-sm sm:text-base touch-manipulation"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeCard;