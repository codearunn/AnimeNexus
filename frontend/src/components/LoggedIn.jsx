import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom";

function LoggedIn() {
  const {logout, user} = useAuth();
  const navigate=useNavigate();
  return (
    <>
      <Link to="/Browse" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Browse</Link>
      <Link to="/MyLibrary" className="text-white  hover:text-red-500 font-extrabold text-lg transition-colors duration-200">My Library</Link>
      <Link to="/recommendations" className="text-white  hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Recommendations</Link>
      <select className="bg-black text-white font-extrabold text-lg">
         <option onClick={() => navigate("/")}>Hi, {user.userName}</option>
         <option onClick={logout} > Logout</option>
         <option onClick={() => navigate("/Profile")}>Profile</option>
      </select>
    </>
  )
}

export default LoggedIn;