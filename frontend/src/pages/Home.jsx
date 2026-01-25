
function Home() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black to-red-900">

      {/* hero section */}
      <section className="text-center mb-4 py-20">
        <h1 className="text-4xl font-bold">
           Welcome to <span className="text-red-500"><span className="text-white">Anime</span>Nexus</span>
        </h1>
        <p className="text-xl text-red-400">
          Track, discover, and connect with the anime world
        </p>
      </section>

      {/* Cards Section */}
      <section className="max-w-7xl mx-auto px-4 mt-12 cursor-pointer">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center
                          hover:shadow-red-500/50 hover:shadow-lg  hover:scale-105 transform transition-transform">
            <div className="text-4xl mb-4 text-red-500">📺</div>
            <h3 className="text-xl font-bold mb-2">Track Anime</h3>
            <p className="text-red-200">
              Keep track of what you watch and plan next
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center
                          hover:shadow-red-500/50 hover:shadow-lg hover:scale-105 transform transition-transform">
            <div className="text-4xl mb-4 text-red-500">🔍</div>
            <h3 className="text-xl font-bold mb-2">Discover Series</h3>
            <p className="text-red-200">
              Find trending and hidden anime gems
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-black bg-opacity-50 border border-red-500 rounded-lg p-6 text-center
                          hover:shadow-red-500/50 hover:shadow-lg  hover:scale-105 transform transition-transform">
            <div className="text-4xl mb-4 text-red-500">💬</div>
            <h3 className="text-xl font-bold mb-2">Join Community</h3>
            <p className="text-red-200">
              Connect with fans and share your passion
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
