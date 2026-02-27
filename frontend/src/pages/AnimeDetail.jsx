import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AIsimilarAnimes from "../components/AI/AIsimilarAnimes";


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

  // summary states
  const [aisummary, setAisummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // similar states
  const [similarAnime, setSimilarAnime] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState("");


  // #4 Include `id` as a dependency so the effect re-runs when navigating between anime pages
  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

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
      // #1 Use anime.malId (numeric Jikan ID), NOT anime._id (MongoDB ObjectId)
      const response = await api.post("/user-anime", {
        animeId: anime.malId,
        status,
        currentEpisode: 0
      });

      // Handle both new addition and already exists
      if (response.data.message === "Already in your list") {
        toast.success("Already in your list!");
      } else {
        toast.success("Added to your list!");
      }
      setOpen(false);
      fetchAnimeDetails();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Already in your list");
      } else {
        toast.error("Failed to add to list");
      }
      console.error("Error adding to list:", error);
    }
  };

  const generateSummary = async () => {
    // #4 Catch null/short synopsis before hitting the AI — give a clear message
    if (!anime?.synopsis || anime.synopsis.trim().length < 50) {
      toast.error("This anime doesn't have enough synopsis data for AI analysis.");
      return;
    }
    if (!anime?.title?.english) {
      toast.error("Anime data incomplete");
      return;
    }

    // #1 Set loading OUTSIDE the inner retry fn — finally would kill it mid-retry
    setSummaryLoading(true);
    setSummaryError("");

    const attemptGenerate = async (retryCount = 0) => {
      try {
        const res = await api.post("/ai/summary", {
          title: anime.title.english,
          synopsis: anime.synopsis,
          genres: anime.genres,
        });

        setAisummary(res.data.summary);

        if (res.data.cached) {
          toast.success("⚡ Loaded from cache (instant!)", {
            duration: 2000,
            icon: "💾"
          });
        }

      } catch (error) {
        if (retryCount === 0) {
          toast("Retrying...", { duration: 1000 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptGenerate(1); // loading stays true throughout retry
        }
        setSummaryError("Failed to generate AI summary");
        toast.error("Failed after 2 attempts. Try again later.");
      }
      // No finally — loading cleared only after retry chain completes
    };

    await attemptGenerate();
    setSummaryLoading(false); // runs once, after both attempts
  };

  const findSimilar = async () => {
    // #4 Same synopsis guard — AI can't work without enough context
    if (!anime?.synopsis || anime.synopsis.trim().length < 50) {
      toast.error("This anime doesn't have enough synopsis data for AI analysis.");
      return;
    }

    // #1 Set loading OUTSIDE the inner retry fn — finally fires mid-retry
    setSimilarLoading(true);
    setSimilarError("");

    const attemptFind = async (retryCount = 0) => {
      try {
        const res = await api.post("/ai/similar", {
          title: anime.title.english,
          synopsis: anime.synopsis,
          genres: anime.genres,
        });

        setSimilarAnime(res.data.similarAnimes);

        if (res.data.cached) {
          toast.success("⚡ Loaded from cache!", {
            duration: 2000,
            icon: "💾"
          });
        }

      } catch (error) {
        if (retryCount === 0) {
          toast("Retrying...", { duration: 1000 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptFind(1); // loading stays true throughout retry
        }
        setSimilarError("Failed to find similar Animes");
        toast.error("Failed after 2 attempts. Try again later.");
      }
      // No finally — loading cleared only after retry chain completes
    };

    await attemptFind();
    setSimilarLoading(false); // runs once, after both attempts
  }

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
        <div className="relative  h-[380px]">
          <img
            src={anime.images.banner}
            loading="lazy"
            className="w-full h-full object-cover opacity-40 blur-sm"
          />

          {/* summary button */}
          <button
            onClick={() => {
              setSummaryOpen(prev => !prev);
              if (!aisummary) generateSummary();
            }}
            disabled={summaryLoading}
            className={`flex items-center mr-auto ml-[300px] mt-6 rounded-xl px-4 py-2 transition-all ${
              summaryLoading
                ? 'text-gray-500 cursor-not-allowed opacity-60'
                : 'text-red-500 hover:scale-105'
            }`}
          >
            {summaryLoading ? (
              <>
                <span className="animate-spin mr-2 text-2xl">⏳</span>
              </>
            ) : summaryOpen ? (
              <div className="mr-[500px]">
                <span>❌</span>
                <span>Close Summary</span>
              </div>
            ) : (
              <>
                <span className="mr-2">✨</span>
                <span>Summarize</span>
                <span className="text-yellow-400 text-4xl ml-2">↯</span>
              </>
            )}
          </button>
          {/* Summary section */}

          {summaryError && (
            <p className="text-red-500 mt-3">{summaryError}</p>
          )}

          <div className="absolute inset-0  bg-gradient-to-t from-black via-black to-transparent"></div>
        </div>


        {/* Poster */}
        <img
          src={anime.images.poster}
          loading="lazy"
          className="absolute bottom-[-80px] left-10 w-52 rounded-xl border-4 border-red-600 shadow-2xl"
        />
      </div>

      {summaryOpen && (
        <div className="mt-4 mx-auto bg-red-950/40 border border-red-900 p-4 rounded-xl max-w-xl">
          <h3 className="text-red-500 font-bold mb-2">✨ AI Summary</h3>

          {summaryLoading ? (
            <div className="space-y-2 w-72 animate-pulse mt-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>
                {aisummary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
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

          {/* ACTION BUTTON — requires login to write to library */}
          {user && (
            <button
              onClick={() => setOpen(true)}
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-bold shadow-lg mb-5"
            >
              {stats.userStats ? "Update Status" : "Add to My List"}
            </button>
          )}

          {/* Find Similar — available to everyone, consistent with Summarize button */}
          <button
            onClick={findSimilar}
            disabled={similarLoading}
            className={`bg-black hover:bg-gray-900 p-3 rounded-xl font-bold shadow-lg mb-5 ml-[300px] text-xl transition-all flex items-center ${
              similarLoading
                ? 'text-gray-500 cursor-not-allowed opacity-60'
                : 'text-red-600 hover:scale-105'
            }`}
          >
            {similarLoading ? (
              <>
                <span className="animate-spin mr-2 text-2xl">🔄</span>
                <span>Finding Similar Anime...</span>
              </>
            ) : (
              <>
                <span className="text-yellow-500 mr-2">↓↓↓↓</span>
                <span>Find Similar Animes</span>
              </>
            )}
          </button>
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
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={() => setOpen(false)}
        >
          <div 
            className="bg-gray-900 p-4 sm:p-6 rounded-xl w-full max-w-sm space-y-2 sm:space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Select Status</h3>

            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToList(s);
                }}
                className="w-full bg-gray-800 hover:bg-red-600 active:bg-red-700 py-3 rounded-lg 
                           capitalize font-semibold transition touch-manipulation text-sm sm:text-base"
              >
                {s.replace("-", " ")}
              </button>
            ))}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
              className="w-full text-gray-400 hover:text-white border border-gray-700 py-3 rounded-lg 
                         mt-3 sm:mt-4 font-semibold transition touch-manipulation text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}


      {/* Show loading skeleton OR actual results OR nothing */}
      {(similarLoading || similarAnime.length > 0) && (
        <AIsimilarAnimes
          similarAnime={similarAnime}
          loading={similarLoading}
          similarError={similarError}
        />
      )}
    </div>
  );
}