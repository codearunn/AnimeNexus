import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import AnimeCard from "../components/AnimeCard";
import SkeletonCard from "../components/SkeletonCard";

function Browse() {
  // state Mangement
  const [anime, setAnime] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState("");

  // search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [genres, setGenres] = useState([]);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnime = useCallback(async () => {
    try {
      setBrowseLoading(true);
      setBrowseError("");

      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedGenre) params.append("genre", selectedGenre);
      if (selectedStatus) params.append("status", selectedStatus);
      params.append("page", page);
      params.append("limit", 10);

      const res = await api.get(`/anime/search?${params.toString()}`);
      const data = res.data;

      setAnime(data.data);
      setTotalPages(data.pagination?.last_visible_page || 1);
    } catch (error) {
      console.error("Error in fetchAnime:", error);
      
      // Show user-friendly error messages
      if (error.response?.status === 429) {
        setBrowseError("⏳ Too many requests. Please wait 10 seconds and try again.");
      } else if (error.response?.status === 504) {
        setBrowseError("🔌 Jikan API is temporarily down. Try again in a minute.");
      } else {
        setBrowseError("❌ Failed to load anime. Please try again.");
      }
    } finally {
      setBrowseLoading(false);
    }
  }, [searchQuery, selectedGenre, selectedStatus, page]);

  useEffect(() => {
    // Fetch genres first, then anime after a delay
    const initializePage = async () => {
      await fetchGenres();
      // Wait 1.5 seconds before fetching anime to avoid rate limit
      setTimeout(() => {
        fetchAnime();
      }, 1500);
    };
    
    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch anime when filters change (but not on initial mount)
  useEffect(() => {
    // Skip if this is the initial render (anime will be fetched by initializePage)
    if (searchQuery || selectedGenre || selectedStatus || page > 1) {
      fetchAnime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedGenre, selectedStatus, page])

  const fetchGenres = async () => {
    try {
      // Don't show loading for genres (loads in background)
      const res = await api.get("/anime/genres");
      const data = res.data;
      setGenres(data.data);
    } catch (error) {
      console.error("Error in fetchGenres:", error);
      // Silently fail for genres - not critical
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl max-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-8">Browse Anime</h1>

        {/* Search Bar */}
        <SearchBar
          onSearch={setSearchQuery}
          initialValue={searchQuery}
        />
      </div>


      {/* Filter Bar */}
      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />
      {/* Loading State */}
      {browseLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                  lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(12)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {browseError && (
        <div className="bg-red-900/20 border border-red-600 text-red-400
                          px-6 py-4 rounded-lg mb-6">
          {browseError}
        </div>
      )}

      {/* Anime Grid */}
      {!browseLoading && !browseError && (
        <>
          {anime.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">No anime found</p>
              <p className="text-gray-500 mt-2">Try different search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {anime.map((item) => (
                <AnimeCard key={item._id} anime={item} />
              ))}
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 m-auto">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-6 py-3 bg-red-800 text-white rounded-lg
                             hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors"
              >
                Previous
              </button>

              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg
                             hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Browse