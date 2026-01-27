import { Link } from "react-router-dom";
function LoggedOut() {
  return (
    <>
      <Link to="/login" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Login</Link>
      <Link to="/register" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Create Account</Link>
    </>
  )
}

export default LoggedOut