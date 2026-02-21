import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Redirect after login
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  const handelLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please fill all fields");
      return;
    }

    setFormError("");
    await login({ email, password });
    // Token is stored in httpOnly cookie by backend - no need for localStorage
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <form onSubmit={handelLogin}
        className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-6 sm:mb-8 text-center"
        >Login to AnimeNexus</h2>

        {formError && (<p className="text-red-500 mb-3">{formError}</p>)}
        {error && (<p className="text-red-500 mb-3">{error}</p>)}
        <label className="block text-gray-400 text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md
          focus:outline-none focus:border-red-600 text-white mb-4"
        />
        <label className="block text-gray-400 text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md
          focus:outline-none focus:border-red-600 text-white mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition flex items-center justify-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-red-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "Login"
          )}
        </button>

        {/* Register */}
        <p className="text-gray-400 text-center mt-4">
          New here?{" "}
          <Link to="/register" className="text-red-500 hover:text-red-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}


export default Login