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

  const originalDisplayName = useMemo(
    () => (user?.profile?.displayName || user?.userName || "").trim(),
    [user]
  );
  const originalBio = useMemo(() => (user?.profile?.bio || "").trim(), [user]);

  const isChanged =
    displayName.trim() !== originalDisplayName || bio.trim() !== originalBio;

  const apiBase =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "";
  const avatarPath = user?.profile?.avatar || "/images/defaultPFP.jpg";
  const avatarSrc =
    avatarPath?.startsWith("http") ? avatarPath : `${apiBase}${avatarPath}`;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await api.put("/auth/profile", {
          displayName,
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

  // delete account section
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const { deleteAccount } = useAuth();

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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    const success = await deleteAccount(deletePassword);
    if (success) {
      // User will be logged out and redirected automatically
      window.location.href = "/";
    } else {
      setDeletePassword("");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="border border-red-900/60 bg-gradient-to-br from-red-950/40 via-black to-red-950/40 rounded-2xl p-8 shadow-[0_0_0_1px_rgba(220,38,38,0.15)]">
            <h1 className="text-2xl font-extrabold text-red-500">Profile</h1>
            <p className="mt-2 text-gray-400">
              Please sign in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top header */}
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Your <span className="text-red-500">Profile</span>
            </h1>
            <p className="mt-1 text-gray-400">
              Manage your identity, stats, and account security.
            </p>
          </div>

          <button
            onClick={() => setEdit(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-900/60 bg-gradient-to-r from-red-950/40 via-black to-red-950/40 px-4 py-2 text-sm font-semibold text-gray-100 hover:text-white hover:border-red-700/60 transition"
          >
            Edit profile
            <span aria-hidden>✨</span>
          </button>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: profile card */}
          <section className="lg:col-span-2 border border-red-900/60 rounded-2xl overflow-hidden bg-gradient-to-br from-red-950/40 via-black to-red-950/40 shadow-[0_0_0_1px_rgba(220,38,38,0.12)]">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                <img
                  src={avatarSrc}
                  alt="Profile avatar"
                  className="h-20 w-20 md:h-28 md:w-28 rounded-full object-cover ring-2 ring-red-700/40"
                />
                <div className="md:hidden">
                  <p className="text-xl font-extrabold">
                    {(user?.profile?.displayName || user?.userName || "User")}
                  </p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="hidden md:block">
                  <h2 className="text-4xl font-extrabold leading-tight">
                    <span className="text-red-500">
                      {(user?.profile?.displayName || user?.userName || "User")}
                    </span>
                  </h2>
                  <p className="mt-1 text-gray-300">{user?.email}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Member since
                    </p>
                    <p className="mt-1 font-semibold text-gray-100">
                      {user?.createdAt
                        ? new Date(user.createdAt).toISOString().split("T")[0]
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Username
                    </p>
                    <p className="mt-1 font-semibold text-gray-100">
                      {user?.userName}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Bio
                  </p>
                  <p className="mt-2 text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {user?.profile?.bio || "Add a bio to tell other fans what you’re into."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right: stats */}
          <aside className="border border-red-900/60 rounded-2xl bg-gradient-to-br from-red-950/40 via-black to-red-950/40 p-6 shadow-[0_0_0_1px_rgba(220,38,38,0.12)]">
            <h3 className="text-lg font-extrabold text-red-400">
              Stats
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Snapshot from your library.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Total</p>
                <p className="mt-2 text-3xl font-extrabold text-red-500">{stats.totalAnime}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Completed</p>
                <p className="mt-2 text-3xl font-extrabold text-red-500">{stats.completed}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Watching</p>
                <p className="mt-2 text-3xl font-extrabold text-red-500">{stats.watching}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Episodes</p>
                <p className="mt-2 text-3xl font-extrabold text-red-500">{stats.totalEpisodesWatched}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Account settings */}
        <section className="mt-6 border border-red-900/60 rounded-2xl bg-gradient-to-br from-red-950/30 via-black to-red-950/30 p-6 shadow-[0_0_0_1px_rgba(220,38,38,0.10)]">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-extrabold">
                Account <span className="text-red-500">Security</span>
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Update your password to keep your account safe.
              </p>
            </div>
            <button
              onClick={() => setShowPasswordform(!showPasswordform)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition text-sm font-semibold"
            >
              {showPasswordform ? "Close" : "Change Password"}
            </button>
          </div>

          {showPasswordform && (
            <form
              onSubmit={handleChangePassword}
              className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="text-sm font-semibold text-gray-200">
                  Current password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/60 border border-red-900/50 px-4 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/25"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/60 border border-red-900/50 px-4 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/25"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 8 characters.
                </p>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setShowPasswordform(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition text-sm font-extrabold text-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update password"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Delete Account Section */}
        <section className="mt-6 border border-red-900/60 rounded-2xl bg-gradient-to-br from-red-950/30 via-black to-red-950/30 p-6 shadow-[0_0_0_1px_rgba(220,38,38,0.10)]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-extrabold">
                Danger <span className="text-red-500">Zone</span>
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Permanently delete your account and all associated data.
              </p>
              <p className="mt-2 text-xs text-red-400">
                ⚠️ This action cannot be undone!
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 hover:border-red-600 transition text-sm font-semibold text-red-400 hover:text-red-300"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* Delete Account - First Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-600/60 bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-extrabold text-red-400">Delete Account?</h3>
              </div>
              
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete your account? This will permanently remove:
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Your profile and personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>Your entire anime library ({stats.totalAnime} anime)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>All ratings and progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>This action cannot be undone</span>
                </li>
              </ul>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShowConfirmModal(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-sm font-extrabold text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account - Password Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-600/60 bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-extrabold text-red-400">Confirm Deletion</h3>
              </div>
              
              <p className="text-gray-300 mb-4">
                Enter your password to permanently delete your account.
              </p>

              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-200">Password</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl bg-black/60 border border-red-900/50 px-4 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/25"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setDeletePassword("");
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || !deletePassword}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-sm font-extrabold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit profile modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-red-900/60 bg-gradient-to-br from-gray-950 via-black to-gray-950 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-extrabold text-red-400">Edit profile</h3>
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="rounded-lg px-3 py-1 text-gray-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-200">Display name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/60 border border-red-900/50 px-4 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/25"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200">Bio</label>
                <textarea
                  placeholder="Write your bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/60 border border-red-900/50 px-4 py-3 text-white outline-none focus:border-red-600 focus:ring-2 focus:ring-red-700/25 resize-none"
                  rows={5}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDisplayName(originalDisplayName);
                    setBio(originalBio);
                    setEdit(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isChanged || loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition text-sm font-extrabold text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile;