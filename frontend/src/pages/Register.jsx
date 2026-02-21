import {useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const {register, user, loading, error} = useAuth();
  const navigate= useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if(user){
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegister= async (e) => {
    e.preventDefault();

    if(!userName || !email || !password){
      setFormError("Please fill all fields");
      return;
    }
    if(userName.length<3 || userName.length>20){
      return setFormError("Username must be between 3-20 characters");
    }
    const emailRegEx= /^\S+@\S+\.\S+$/;
    if(!emailRegEx.test(email)){
      return setFormError("Invalid email format");
    }
    if(password.length<8){
      return setFormError("Password must be at least 8 characters long");
    }

    setFormError("");
    const success = await register({userName, email, password});
    // If registration successful, navigate to home
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-cal[100vh-10rem] bg-black flex item-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="max-w-md max-auto bg-gray-900 rounded-2xl mt-10 mb-24 shadow-xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-red-600 mb-8 text-center">Signup to AnimeNexus</h1>

        {formError && (<p className="text-red-500 mb-3">{formError}</p>)}
        {error && (<p className="text-red-500 mb-3">{error}</p>)}

        <label className="text-gray-600 block text-sm mb-1">User Name</label>
        <input
          type="text"
          placeholder="enter user name"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md
        focus:outline-none focus:border-red-600 text-white mb-5"
        />

        <label className="text-gray-600 block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md
        focus:outline-none focus:border-red-600 text-white mb-5"
        />

        <label className="text-gray-600 block text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md
        focus:outline-none focus:border-red-600 text-white mb-5"
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
            "Signup"
          )}
        </button>

        {/* LOGIN */}
      <p className="text-gray-400 text-center mt-6">
        Already a user?{" "}
        <Link to="/login" className="text-red-500 hover:text-red-400">
          Login
        </Link>
      </p>
      </form>
    </div>
  )
}

export default Register