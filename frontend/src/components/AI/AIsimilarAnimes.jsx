function AIsimilarAnimes({similarAnime, loading}) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-black p-10">
        <h2 className="text-3xl font-bold text-red-600 mb-6">🤖 AI Recommended Similar Anime</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="relative bg-gray-900 rounded-lg overflow-hidden animate-pulse"
            >
              {/* Skeleton Image */}
              <div className="w-full h-80 bg-gray-800"></div>

              {/* Skeleton Badges */}
              <div className="absolute top-2 right-2 bg-gray-700 w-16 h-6 rounded-full"></div>
              <div className="absolute top-2 left-2 bg-gray-700 w-20 h-6 rounded-full"></div>

              {/* Skeleton Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4">
                <div className="bg-gray-700 h-6 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-700 h-4 w-full rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No results
  if (!similarAnime || similarAnime.length === 0) {
    return (
      <div className="bg-black p-10">
        <p className="text-gray-400 text-center text-xl">No recommendations yet. Click "Find Similar Anime" button!</p>
      </div>
    );
  }

  // Actual content
  return (
    <div className="bg-black p-10">

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {similarAnime.map((anime, ind) => (
          <div
            key={ind}
            className="group relative bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Poster Image */}
            <img
              src={anime.images?.poster || '/placeholder.jpg'}
              alt={anime.title?.english || anime.title}
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Rating Badge */}
            {anime.rating?.average && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                ⭐ {anime.rating.average.toFixed(1)}
              </div>
            )}

            {/* Match Score Badge */}
            {anime.aiMatchScore && (
              <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                {anime.aiMatchScore}% Match
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4">
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                {anime.title?.english || anime.title}
              </h3>

              {/* AI Reason */}
              {anime.aiReason && (
                <p className="text-gray-300 text-sm line-clamp-2">
                  {anime.aiReason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIsimilarAnimes