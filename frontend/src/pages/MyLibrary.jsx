import {useState, useEffect, useMemo} from 'react'
import toast from "react-hot-toast";
import api from "../api/axios";
import Loading from "../components/Loading";
import LibraryCard from "../components/LibraryCard";
import { useAuth } from '../context/AuthContext';
import StatusTab from '../components/StatusTab';
import SortDropDown from '../components/SortDropDown';
import StatsDashboard from '../components/StatsDashboard';
import EmptyState from '../components/EmptyState';


function MyLibrary() {
  const {user} = useAuth();

  const [userAnimeList, setUserAnimeList] = useState([]);
  const [activeTab, setActiveTab] = useState("watching");
  const [sortBy, setSortBy] = useState(localStorage.getItem("librarySort") || "recent");

  const [loading, setLoading] = useState(false);

  // “Only recalc when userAnimeList changes”
  const stats = useMemo(() => {
    const totalAnime = userAnimeList.length;
    const totalEpisodeWatched = userAnimeList.reduce((sum, anime) => sum+anime.currentEpisode,0);

    let avgRating ;
    let animeWithRating = userAnimeList.filter(anime => anime.rating!=undefined);
    const ratedSum= animeWithRating.reduce((sum, anime) => sum+anime.rating,0);
    avgRating= animeWithRating.length===0? 0: (ratedSum/animeWithRating.length).toFixed(1);

    const completedAnime = userAnimeList.filter(anime => anime.status ==="completed").length;
    const completionRate = totalAnime===0?0: Math.round((completedAnime/totalAnime)*100);

    const flatternAllGeners = userAnimeList
      .filter(anime => anime.animeId)  // Filter out null animeId to prevent crashes
      .map(anime => anime.animeId.genres)
      .flat();
    const countGenres= {};
    flatternAllGeners.forEach(genre => {
      countGenres[genre]= (countGenres[genre]||0)+1;
    });
    let mostWatchedGenre = "none";
    let max=0;
    for(let genre in countGenres){
      if(countGenres[genre]>max){
        max= countGenres[genre];
        mostWatchedGenre=genre;
      }
    }
    return {
      totalAnime,
      totalEpisodeWatched,
      avgRating,
      completionRate,
      mostWatchedGenre
    };
    }, [userAnimeList]);


  useEffect(() => {
    fetchUserAnime();
  }, [])


  const fetchUserAnime = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user-anime");
      setUserAnimeList(res.data.data);
    } catch (error) {
      console.error("Error in fetchUserAnime:", error);
      toast.error("Failed to load library");
    } finally{
      setLoading(false);
    }
  };

  // Filter by status AND ensure animeId exists
  const filteredAnimeByStatus = userAnimeList.filter(anime =>
    anime.status === activeTab && anime.animeId
  );

  const sortedAnime = [...filteredAnimeByStatus].sort((a,b) =>{
    switch (sortBy) {
      case "title-asc":
          return a.animeId.title.english.localeCompare(b.animeId.title.english);

      case "title-desc":
          return b.animeId.title.english.localeCompare(a.animeId.title.english);

      case "rating-high":
          return (b.rating || 0) - (a.rating || 0);  // negative → a comes first
                                                    // positive → b comes first
                                                    // 0 → no change
      case "rating-low":
          return (a.rating || 0) - (b.rating || 0);

      case "progress":
        { const aProgress = a.animeId ? (a.currentEpisode / a.animeId.episodes) : 0;
        const bProgress = b.animeId ? (b.currentEpisode / b.animeId.episodes) : 0;
        return bProgress - aProgress; }

      case "recent":
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  const [showCheckBoxonAllAnimeCards, setShowCheckBoxonAllAnimeCards] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState([]);

  const handleBulkStatusChange =async (newStatus) => {
    if(selectedAnime.length ===0){
      toast.error("No anime selected");
      return;
    }
    try {
      await Promise.all(
        selectedAnime.map(id => api.put(`/user-anime/${id}`, {status:newStatus}))
      );
      toast.success(`Updated ${selectedAnime.length} anime to ${newStatus}`);
        // Reset everything
        setSelectedAnime([]);
        setShowCheckBoxonAllAnimeCards(false);

        // Refresh list
        fetchUserAnime();
    } catch (error) {
      toast.error("Failed to change status");
      console.log("Error in handleBulkStatusChange", error);
    }
  }

  const handleBulkDelete = async () => {
    if(selectedAnime.length===0){
      toast.error("No anime selected");
      return;
    }
    const confirmDelete = window.confirm(
      `Delete ${selectedAnime.length} anime from your library?`
    );
    if (!confirmDelete) return;

    try {

      await Promise.all(
        selectedAnime.map(id => api.delete(`/user-anime/${id}`))
      );
      toast.success(`Deleted ${selectedAnime.length} from Your Library`);
      setSelectedAnime([]);
      setShowCheckBoxonAllAnimeCards(false);

      // Refresh list
      fetchUserAnime();
    } catch (error) {
      toast.error("Failed to remove animes");
      console.log("Error in handleBulkDelete", error);
    }
  }

  if(loading){
    return(
      <Loading/>
    )
  }
  return (
    <div className="min-h-screen mx-auto px-4 py-8 bg-black">

      <h1 className="text-5xl font-extrabold text-red-700 mb-6 text-center">
        {user?.userName || "My"}'s Library
      </h1>

      {/* Status Tab */}
      <StatusTab
        userAnime={userAnimeList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <SortDropDown
        sortBy={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
          localStorage.setItem("librarySort", e.target.value);
        }}
      />

      {/* Empty State */}
      {sortedAnime.length === 0 ? (
        <EmptyState status={activeTab} />
      ) : (
        <>
          <StatsDashboard stats={stats} />

          <div className='flex'>
            {/* Select Multiple */}
            <button
              onClick={() =>setShowCheckBoxonAllAnimeCards(!showCheckBoxonAllAnimeCards)}
              className='bg-red-700 font-bold text-sm text-black p-1 rounded-2xl shadow-md hover:shadow-red-900 hover:scale-105'
            >Select Mutilple</button>

            {/* Action Bar */}
            {showCheckBoxonAllAnimeCards && (
              <div className='ml-auto'>
                <select
                  onChange={(e) =>handleBulkStatusChange(e.target.value)}
                  defaultValue=""
                  className='bg-black text-white m-2 cursor-pointer'>
                <option value=""> Change Status</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="plan-to-watch">Plan To Watch</option>
                <option value="on-hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>

              <button
                onClick={handleBulkDelete}
                className='text-red-700 m-2'
              >
                Delete Selected
              </button>
              </div>
            )}
          </div>


          {/* Anime Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {sortedAnime.map((anime) => (
              <LibraryCard
              key={anime._id}
              anime={anime}
              onUpdate={fetchUserAnime}
              showCheckBoxonAllAnimeCards={showCheckBoxonAllAnimeCards}
              selected={selectedAnime}
              setSelected={setSelectedAnime} />
            ))}
          </div>
        </>
      )}

    </div>
  )
}

export default MyLibrary