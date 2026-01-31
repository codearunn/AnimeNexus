import {useState, useEffect} from 'react'
import toast from "react-hot-toast";
import api from "../api/axios";
import Loading from "../components/Loading";
import LibraryCard from "../components/LibraryCard";
import { useAuth } from '../context/AuthContext';
import StatusTab from '../components/StatusTab';

function MyLibrary() {
  const {user} = useAuth();

  const [userAnimeList, setUserAnimeList] = useState([]);
  const [activeTab, setActiveTab] = useState("watching");
  const [loading, setLoading] = useState(false);

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

      {/* Empty State */}
      {filteredAnimeByStatus.length === 0 && (
        <p className="text-gray-400 text-center mt-12">
          No anime in this category yet.
        </p>
      )}

      {/* Status Tab */}
      <StatusTab
        userAnime={userAnimeList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Anime Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {filteredAnimeByStatus.map((anime) => (
          <LibraryCard key={anime._id} anime={anime} />
        ))}
      </div>

    </div>
  )
}

export default MyLibrary