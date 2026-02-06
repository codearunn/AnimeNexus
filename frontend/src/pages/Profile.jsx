import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

function Profile() {
  const { user, setUser } = useAuth();

  const [edit, setEdit] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.profile?.displayName || user.userName || "");
      setBio(user.profile?.bio || "");
    }
  }, [user]);

  const isChanged = displayName.trim() !== user?.userName || bio.trim() !== user?.profile?.bio;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", {
          userName: displayName,
          bio
      });

      setUser(res.data.user);
      toast.success("Profile updated!");
      setEdit(false);

    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      console.error("Error in handleUpdateProfile", error);
    } finally{
      setLoading(false);
    }
  };

  // stats state
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchUserAnimeforStats = async () => {
      try {
        const res = await api.get("/user-anime");
        setLibrary(res.data.data);
      } catch (error) {
        toast.error("Failed to load Stats");
        console.error("Error in Fetching stats", error);
      }
    }
    fetchUserAnimeforStats();
  }, []);

  const stats = useMemo(() => {
    const totalAnime = library.length;
    const completed = library.filter(anime => anime.status === "completed").length;
    const watching = library.filter(anime => anime.status === "watching").length;
    const totalEpisodesWatched = library.reduce(
      (sum, anime) => sum + (anime.currentEpisode || 0), 0);

    return {
      totalAnime,
      completed,
      watching,
      totalEpisodesWatched
    }
  }, [library]);

  // password section
  const [showPasswordform, setShowPasswordform] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword= async (e) => {
    e.preventDefault();
    if(newPassword.length<8){
      toast.error("password must 8 characters long");
      return;
    }
    try {
      setLoading(true);
      await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordform(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.log("Error in handleChangePassword:", error);
    } finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="flex justify-between items-center">

        {/* Profile Header */}
        <div className="flex p-10 border-2 border-red-900 w-[900px] rounded-xl mt-10 bg-gradient-to-br from-red-950/70 via-black to-red-950/70 shadow-md shadow-red-700">
          <div>
            <img
              src={`http://localhost:8000${user?.profile?.avatar || "/images/defaultPFP.jpg"}`}
              className="h-32 w-32 rounded-full object-cover"
            />
            <button
              className="text-gray-500 mt-2 ml-6"
              onClick={() => setEdit(!edit)}
            >
              Edit Profile ✨
            </button>

            {edit && (
              <form
               onSubmit={handleUpdateProfile}
               className="bg-zinc-800 w-auto p-0 rounded-xl text-white"
              >
                <div className="flex items-center justify-center p-2 ">
                  <button
                    type="button"
                    onClick={() => setEdit(false)}
                  >❌️</button>
                </div>
                <div className="p-2">
                  <label className="mr-2">user name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black border border-red-800 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="p-2">
                  <label className="block">Bio</label>
                  <textarea
                    placeholder="Write your bio..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-black border border-red-800 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-red-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-center items-center p-2">
                  <button
                    type="submit"
                    disabled={!isChanged || loading}
                    className={`border  p-2  rounded-lg text-md shadow-md  transition
                              ${isChanged ? " border-red-700 bg-black text-red-900 hover:text-red-600 hover:shadow-red-900"
                        : " border-zinc-700 bg-zinc-700 text-gray-500 cursor-not-allowed hover:shadow-zinc-900"
                      }
                            `}
                  >
                    save changes
                  </button>
                </div>

              </form>
            )}
          </div>

          <div className="text-white ml-10 " >
            <p className="font-extrabold text-7xl font-horror text-red-500">
             {(user?.profile?.displayName || user?.userName || "DEFAULT").toUpperCase()}
            </p>

            <p className="mt-2 font-metal"><label>Email:</label> {user?.email}</p>
            <p className="mt-1 font-reggae text-xl font-bold">
              <label className="text-red-800 border-b-2 border-red-900">Member since:</label>
              &nbsp; {user?.createdAt
                ? new Date(user.createdAt).toISOString().split("T")[0]
                : "Loading..."}
            </p>
            <h4 className="mt-5 text-lg font-manga text-red-400">
              <label className="text-gray-500">Bio📌</label>
              &nbsp; {user?.profile?.bio}
            </h4>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-2  text-white border-none w-[500px] h-[320px] mt-10 ">
          <div className="border-2 rounded-xl  border-red-900 p-6 text-center bg-gradient-to-br from-red-950/70 via-black to-red-950/70 shadow-md shadow-red-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105">
            <span className="fond-bold text-gray-400 text-lg">Total Anime</span>
            <h1 className="text-7xl p-3 text-red-700 font-extrabold">{stats.totalAnime}</h1>
          </div>
          <div className="border-2 rounded-xl  border-red-900 p-6 text-center bg-gradient-to-br from-red-950/70 via-black to-red-950/70 shadow-md shadow-red-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105">
            <span className="fond-bold text-gray-400 text-lg">Completed</span>
            <h1 className="text-7xl p-3 text-red-700 font-extrabold ">{stats.completed}</h1>
          </div>
          <div className="border-2 rounded-xl  border-red-900 p-6 text-center bg-gradient-to-br from-red-950/70 via-black to-red-950/70 shadow-md shadow-red-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105">
            <span className="fond-bold text-gray-400 text-lg">Watching</span>
            <h1 className="text-7xl p-3 text-red-700 font-extrabold">{stats.watching}</h1>
          </div>
          <div className="border-2 rounded-xl  border-red-900 p-6 text-center bg-gradient-to-br from-red-950/70 via-black to-red-950/70 shadow-md shadow-red-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105">
            <span className="fond-bold text-gray-400 text-md ">Total Episodes Watched </span>
            <h1 className="text-7xl p-3 text-red-700 font-extrabold">{stats.totalEpisodesWatched}</h1>
          </div>
        </div>

      </div>

      {/* Security Section */}
      <div className="p-5 max-w-md">
        <h1 className="text-2xl text-white mt-5 mb-0 font-extrabold">Account Setting ⚙️</h1>
        <div className="mt-8 bg-black border border-red-500/70 rounded-lg p-6">
          <button
            onClick={() => setShowPasswordform(!showPasswordform)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >Change Password</button>
          {showPasswordform && (
            <form
              onSubmit={handleChangePassword}
              className="bg-gray-600 p-2 rounded-xl mt-3"
            >
              <div className="mt-2">
                <label className="font-bold mr-1">Current Password:</label>
                <input
                 type="password"
                 value={currentPassword}
                 onChange={(e) => setCurrentPassword(e.target.value)}
                 className="bg-black focus:outline-none border rounded-md focus:border-red-500 text-white p-1 w-full"
                />
              </div>

              <div className="mt-2">
                <label className="font-bold ">New Password:</label>
                <input
                 type="password"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 className="bg-black focus:outline-none border rounded-md focus:border-red-500 text-white p-1 w-full"
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-black text-red-900 mt-2 p-2 rounded-lg"
                > update Password</button>
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  )
}

export default Profile;