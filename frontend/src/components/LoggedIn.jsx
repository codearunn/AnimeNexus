import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoggedIn() {
  const {logout, user} = useAuth();
  const navigate=useNavigate();
  const [menuValue, setMenuValue] = useState("");

  const handleMenuChange = async (e) => {
    const value = e.target.value;
    setMenuValue(""); // reset back to placeholder

    if (value === "profile") {
      navigate("/Profile");
      return;
    }

    if (value === "logout") {
      await logout();
      navigate("/");
    }
  };

  return (
    <>
      <Link to="/Browse" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Browse</Link>
      <Link to="/MyLibrary" className="text-white  hover:text-red-500 font-extrabold text-lg transition-colors duration-200">My Library</Link>
      <select
        className="bg-black text-white font-extrabold text-lg cursor-pointer"
        value={menuValue}
        onChange={handleMenuChange}
      >
         <option value="" disabled>Hi, {user.userName}</option>
         <option value="profile">Profile</option>
         <option value="logout">Logout</option>
      </select>
    </>
  )
}

export default LoggedIn;