import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

function Header() {
  const {user} = useAuth();

  return (
    <header className="w-full bg-black h-16 text-white shadow-xl border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
        <Link to="/" className="flex ">
        <img src="/images/logo.png" className=" w-11 h-11 rounded-full"/>
        <h1 className="ml-2 text-4xl font-extrabold ">Anime<span className="text-red-600">Nexus</span></h1>
        </Link>
        <nav className="ml-auto flex space-x-8">
          <Link to="/" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Home</Link>
          {user ? (
            <LoggedIn/>
          ):(
            <LoggedOut/>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header