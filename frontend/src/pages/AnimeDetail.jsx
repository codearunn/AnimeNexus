import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "watching",
  "completed",
  "plan-to-watch",
  "on-hold",
  "dropped"
];

export default function AnimeDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [anime, setAnime] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAnimeDetails();
    // eslint-disable-next-line
  }, []);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/anime/${id}/details`);
      setAnime(res.data.anime);
      setStats(res.data.stats);
    } catch {
      setError("Failed to load anime");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (status) => {
    try {
      await api.post("/user-anime", {
        animeId: anime._id,
        status,
        currentEpisode: 0
      });

      toast.success("Added to your list!");
      setOpen(false);
      fetchAnimeDetails();
    } catch {
      toast.error("Already in list or failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading anime details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600 text-2xl">
        {error}
      </div>
    );
  }


  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO */}
      <div className="relative h-[380px]">
        <img
          src={anime.images.banner}
          className="w-full h-full object-cover opacity-40 blur-sm"
        />

        {/* Poster */}
        <img
          src={anime.images.poster}
          className="absolute bottom-[-80px] left-10 w-52 rounded-xl border-4 border-red-600 shadow-2xl"
        />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT INFO */}
        <div className="md:col-span-2">

          <h1 className="text-4xl font-black text-red-500 mb-3">
            {anime.title.english}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres.map(g => (
              <span
                key={g}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {anime.synopsis}
          </p>

          <div className="flex gap-6 text-gray-400 text-sm mb-6">
            <span>🎬 {anime.episodes} eps</span>
            <span>📅 {anime.year}</span>
            <span>🏢 {anime.studio}</span>
          </div>

          {/* ACTION BUTTON */}
          {user && (
            <button
              onClick={() => setOpen(true)}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-bold shadow-lg mb-5"
            >
              {stats.userStats ? "Update Status" : "Add to My List"}
            </button>
          )}
        </div>

        {/* RIGHT COMMUNITY GLASS */}
        <div
          className="
            rounded-2xl p-6
            bg-gradient-to-br from-white/10 to-white/0
            backdrop-blur-xl
            border border-white/10
            shadow-xl
            mb-5
          "
        >
          <h2 className="text-2xl font-extrabold text-red-500 mb-6">
            Community Stats
          </h2>

          <div className="flex justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm">Members</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-red-500">
                ⭐ {stats.averageUserRating}
              </p>
            </div>
          </div>

          {Object.entries(stats.statusBreakDown).map(([key, value]) => {
            const percent =
              stats.totalMembers === 0
                ? 0
                : Math.round((value / stats.totalMembers) * 100);

            const colors = {
              watching: "bg-green-500",
              completed: "bg-blue-500",
              "plan-to-watch": "bg-yellow-500",
              "on-hold": "bg-orange-500",
              dropped: "bg-red-500"
            };

            return (
              <div key={key} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{key.replace("-", " ")}</span>
                  <span>{value}</span>
                </div>

                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${colors[key]} h-2`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STATUS MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-80 space-y-3">
            <h3 className="text-xl font-bold mb-4">Select Status</h3>

            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => handleAddToList(s)}
                className="w-full bg-gray-800 hover:bg-red-600 py-2 rounded"
              >
                {s}
              </button>
            ))}

            <button
              onClick={() => setOpen(false)}
              className="w-full text-gray-400 mt-3 "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}