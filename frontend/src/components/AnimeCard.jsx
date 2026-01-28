import { Link } from "react-router-dom"

function AnimeCard({ anime }) {
  return (
    <Link
      to={`/anime/${anime._id}`}
      className="group block bg-black rounded-lg overflow-hidden
      hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300
      transform hover:-translate-y-2"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={anime.images.poster}
          alt={anime.title.english}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
          ⭐ {anime.rating.average.toFixed(1)}
        </div>

        {/* Status */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs uppercase">
          {anime.status}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col h-full">

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
          {anime.title.english}
        </h3>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-3">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
            >
              {genre}
            </span>
          ))}
          {/* Episodes & Year */}
          <div className="flex justify-between text-sm text-gray-400 mt-auto">
            <span className="p-2">{anime.episodes} Episodes</span>
            <span className="p-2">{anime.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AnimeCard;