import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import { useState } from "react";

function Header() {
  const {user} = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white shadow-xl border-b-2 border-red-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/images/logo.png" alt="AnimeNexus logo" className="w-9 h-9 sm:w-11 sm:h-11 rounded-full"/>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
            Anime<span className="text-red-600">Nexus</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/" className="text-white hover:text-red-500 font-extrabold text-base lg:text-lg transition-colors duration-200">
            Home
          </Link>
          {user ? <LoggedIn/> : <LoggedOut/>}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-red-500 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-red-600/50">
          <nav className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-red-500 font-bold text-lg transition-colors py-2"
            >
              Home
            </Link>
            {user ? (
              <div className="space-y-3">
                <Link 
                  to="/browse" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 font-bold text-lg transition-colors py-2"
                >
                  Browse
                </Link>
                <Link 
                  to="/library" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 font-bold text-lg transition-colors py-2"
                >
                  My Library
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 font-bold text-lg transition-colors py-2"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Logout will be handled by LoggedIn component
                  }}
                  className="block w-full text-left text-red-500 hover:text-red-400 font-bold text-lg transition-colors py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 font-bold text-lg transition-colors py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors py-2 px-4 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header