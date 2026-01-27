import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom";

function LoggedIn() {
  const {logout, user} = useAuth();
  return (
    <>
      <Link to="/Browse" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Browse</Link>
      <Link to="/MyLibrary" className="text-white  hover:text-red-500 font-extrabold text-lg transition-colors duration-200">My Library</Link>
      <Link to="/Profile" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Profile</Link>
      <button onClick={logout} className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Logout</button>
      <p className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200"> Hi, {user.userName} </p>
    </>
  )
}

export default LoggedIn;