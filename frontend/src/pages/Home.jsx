import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import SkeletonCard from "../components/SkeletonCard";
import AnimeCard from "../components/AnimeCard";
import {useNavigate} from "react-router-dom";
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

      const res= await api.get("/anime/search?limit=10&page=1");
      setTrendingAnime(res.data.data.slice(0,5)); // take only 5 for homePage
    } catch (error) {
      toast.error("Failed to load trending Animes");
      console.error("Error in fetchTrendingAnime", error);
    } finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black to-red-900">

      {/* Hero Section */}
      <section className="text-center mb-4 py-20">
        <h1 className="text-6xl font-bold tracking-wide mb-4">
          Welcome to <span className="text-red-500">Anime<span className="text-white">Nexus</span></span>
        </h1>
        <p className="text-xl text-red-400">
          Track, discover, and connect with the anime world
        </p>
      </section>

      {/* Call-to-Action Section (Only for non-logged-in users) */}
      {!user && (
        <section className="max-w-5xl mx-auto px-4 mt-12 mb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-3xl p-12 shadow-2xl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-block mb-4">
                  <span className="bg-red-600/10 text-red-500 px-4 py-2 rounded-full text-sm font-semibold border border-red-600/20">
                    Join 10,000+ Anime Fans
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Start Your Anime Journey
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Track your watchlist, discover new series with AI-powered recommendations, 
                  and connect with a passionate community of anime enthusiasts.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-gray-300">Smart Tracking</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-sm text-gray-300">AI Recommendations</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm text-gray-300">Personal Stats</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/register')}
                  className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  Sign In
                </button>
              </div>

              {/* Trust Badge */}
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  No credit card required • Free forever • Cancel anytime
                </p>
              </div>
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
      <section className="max-w-7xl mx-auto px-4 mt-16 pb-5">

        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-bold text-red-500 mb-8">
            🔥 Trending Now
          </h2>
          <div className="text-center mt-8">
          <button
            onClick={() => navigate('/Browse')}
            className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold text-black transition-all hover:scale-105"
          >
            Browse All Anime →
          </button>
        </div>
      </div>

        {loading ?(
          <div className="grid grid-cols-5 gap-6">
            {[...Array(5)].map((_,i) => <SkeletonCard key={i}/>)}
          </div>
        ):(
          <div className="grid grid-cols-5 gap-6">
            {trendingAnime.map(anime => <AnimeCard key={anime._id} anime={anime}/>)}
          </div>
        )}

      </section>


    </div>
  );
}

export default Home;
