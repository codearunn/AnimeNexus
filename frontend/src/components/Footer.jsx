
function Footer() {
  return (
    <footer className="bg-black border-t-2 border-red-600 text-white w-full">

      {/* main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" >

          {/* About */}
          <div>
            <h1 className="border-b-2  border-red-500 text-2xl font-extrabold text-red-600 mb-4">
              About AnimeNexus
            </h1>
            <p> AnimeNexus is gateway to the word of anime.
              Track your favorites, discover new sites, and connect with fellow fans
            </p>
          </div>

          {/* Links */}
          <div >
            <h1 className="border-b-2  border-red-500 text-2xl font-extrabold text-red-600 mb-4">
              Quick Links
            </h1>
            <ul className="space-y-2">
              <li className="text-white hover:text-red-400 transition-colors duration-200 cursor-pointer">
                <span className="text-gray-500">›</span> Home
              </li>
              <li className="text-white hover:text-red-400 transition-colors duration-200 cursor-pointer">
                <span className="text-gray-500">›</span> Browse
              </li>
              <li className="text-white hover:text-red-400 transition-colors duration-200 cursor-pointer">
                <span className="text-gray-500">›</span> My Library
              </li>
              <li className="text-white hover:text-red-400 transition-colors duration-200 cursor-pointer">
                <span className="text-gray-500">›</span> Contact
              </li>
            </ul>
          </div>

          {/* Connects */}
          <div>
            <div className="border-b-2  border-red-500 text-2xl font-extrabold text-red-600 mb-4">
              Social Connect
            </div>
             <div className="flex space-x-6 text-3xl text-red-500 ">
              <span className="hover:text-red-400 transition cursor-pointer">
                <img src="images/f.png" className="rounded-full h-10 w-10"/>
              </span>
              <span className="hover:text-red-400 transition cursor-pointer">
                <img src="images/insta.png" className="rounded-full h-10 w-10"/>
              </span>
              <span className="hover:text-red-400 transition cursor-pointer">
                <img src="images/twitter.png" className="rounded-full h-10 w-10"/>
              </span>
              <span className="hover:text-red-400 transition cursor-pointer">
                <img src="images/yt.png" className="rounded-full h-10 w-10"/>
              </span>
            </div>
          </div>
        </div>

        {/* copyRight Section */}
        <section>
          <div className="mt-2 border-t border-red-600 text-gray-300 w-full text-center py-4">&copy;2026 AnimeNexus. All Right Reserved</div>
        </section>
      </div>

    </footer>
  )
}

export default Footer