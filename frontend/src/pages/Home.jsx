import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import SkeletonCard from "../components/SkeletonCard";
import AnimeCard from "../components/AnimeCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(true); // true=> it will render once page is loaded

  useEffect(() => {
    fetchTrendingAnime();
  }, [])


  const fetchTrendingAnime = async () => {
    try {
      setLoading(true);

      const res = await api.get("/anime/search?limit=10&page=1");
      setTrendingAnime(res.data.data.slice(0, 5)); // take only 5 for homePage
    } catch (error) {
      toast.error("Failed to load trending Animes");
      console.error("Error in fetchTrendingAnime", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black to-red-900">

      {/* Hero Section */}
      <section className="text-center mb-4 py-12 sm:py-16 md:py-20 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          Welcome to <span className="text-red-500">Anime<span className="text-white">Nexus</span></span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-red-400">
          Track, discover, and connect with the anime world
        </p>
      </section>

      {/* Call-to-Action Section (Only for non-logged-in users) */}
      {!user && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 md:mt-18 mb-12 sm:mb-20 md:mb-28">

          {/* CARD */}
          <div className="bg-[#0B0B0B] border border-gray-800 rounded-2xl p-6 sm:p-10 md:p-14 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">

            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                Start Your Anime Journey
              </h2>

              <p className="mt-3 sm:mt-4 md:mt-5 text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
                Track your watchlist, discover new series with intelligent recommendations,
                and explore anime with a smarter experience.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 mt-8 sm:mt-10 md:mt-12">

              <button
                onClick={() => navigate("/register")}
                className="px-6 sm:px-9 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-6 sm:px-9 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
              >
                Sign In
              </button>

            </div>

            {/* Footer line */}
            <div className="mt-8 sm:mt-10 md:mt-12 border-t border-gray-800 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-500">
              Free to use • No credit card required
            </div>

          </div>
        </section>
      )}

      {/* Cards Section */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 - Track Anime */}
          <div
            onClick={() => navigate(user ? '/MyLibrary' : '/login')}
            className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center hover:shadow-red-500/50 hover:shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
          >
            <div className="text-4xl mb-4 text-red-500">📺</div>
            <h3 className="text-xl font-bold mb-2">Track Anime</h3>
            <p className="text-red-200">Keep track of what you watch and plan next</p>
            <div className="mt-4">
              <span className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                {user ? 'Go to My Library →' : 'Login to start tracking →'}
              </span>
            </div>
          </div>

          {/* Card 2 - Discover Series */}
          <div
            onClick={() => navigate('/Browse')}
            className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center hover:shadow-red-500/50 hover:shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
          >
            <div className="text-4xl mb-4 text-red-500">🔍</div>
            <h3 className="text-xl font-bold mb-2">Discover Series</h3>
            <p className="text-red-200">Find trending and hidden anime gems</p>
            <div className="mt-4">
              <span className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                Browse all anime →
              </span>
            </div>
          </div>

          {/* Card 3 - Join Community */}
          <div
            onClick={() => navigate(user ? '/Profile' : '/register')}
            className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center hover:shadow-red-500/50 hover:shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
          >
            <div className="text-4xl mb-4 text-red-500">💬</div>
            <h3 className="text-xl font-bold mb-2">Join Community</h3>
            <p className="text-red-200">Connect with fans and share your passion</p>
            <div className="mt-4">
              <span className="text-sm text-gray-400 hover:text-red-400 transition-colors">
                {user ? 'View your profile →' : 'Sign up to join →'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Trending Anime Section */}
      <section className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16 pb-5">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-2 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500">
            🔥 Trending Now
          </h2>
          <button
            onClick={() => navigate('/Browse')}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 sm:py-3 rounded-xl font-bold text-black transition-all hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
          >
            Browse All Anime →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {trendingAnime.map(anime => <AnimeCard key={anime._id} anime={anime} />)}
          </div>
        )}

      </section>


    </div>
  );
}

export default Home;
