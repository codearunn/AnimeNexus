
function Header() {
  return (
    <header className="w-full bg-black h-16 text-white shadow-xl border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center">
        <img src="/images/logo.png" className=" w-11 h-11 rounded-full"/>
        <h1 className="ml-2 text-4xl font-extrabold ">Anime<span className="text-red-600">Nexus</span></h1>
        <nav className="ml-auto hidden md:flex space-x-8">
          <a href="#" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Home</a>
          <a href="#" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Browse</a>
          <a href="#" className="text-white  hover:text-red-500 font-extrabold text-lg transition-colors duration-200">My Library</a>
          <a href="#" className="text-white hover:text-red-500 font-extrabold text-lg transition-colors duration-200">Profile</a>
        </nav>

        {/* Mobile menu button */}
          <div className="ml-auto md:hidden">
            <button className="text-white hover:text-red-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
      </div>
    </header>
  )
}

export default Header