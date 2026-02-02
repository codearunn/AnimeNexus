import {useState, useEffect, useMemo} from 'react'
import toast from "react-hot-toast";
import api from "../api/axios";
import Loading from "../components/Loading";
import LibraryCard from "../components/LibraryCard";
import { useAuth } from '../context/AuthContext';
import StatusTab from '../components/StatusTab';
import SortDropDown from '../components/SortDropDown';
import StatsDashboard from '../components/StatsDashboard';


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

    const flatternAllGeners = userAnimeList.map(anime =>
                                            anime.animeId.genres).flat();
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
      console.log("Error in fetchUserAnime:", error);
      toast.error("Failed to load library");
    } finally{
      setLoading(false);
    }
  };

  const filteredAnimeByStatus = userAnimeList.filter(anime => anime.status === activeTab);

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
        return (b.currentEpisode / b.animeId.episodes)-(a.currentEpisode / a.animeId.episodes);

      case "recent":
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  })


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
      {sortedAnime.length === 0 && (
        <p className="text-gray-400 text-center mt-12">
          No anime in this category yet.
        </p>
      )}

      <StatsDashboard stats={stats} />
      {/* Anime Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {sortedAnime.map((anime) => (
          <LibraryCard
          key={anime._id}
          anime={anime}
          onUpdate={fetchUserAnime} />
        ))}

      </div>

    </div>
  )
}

export default MyLibrary