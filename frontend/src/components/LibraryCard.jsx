import {Link} from 'react-router-dom'

function LibraryCard({anime}) {
  return (
    <div
      className="group block bg-black rounded-lg overflow-hidden
      hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300
      transform hover:-translate-y-2"
    >

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link to={`/anime/${anime._id}`}>
          <img
            src={anime?.animeId?.images?.poster}
            alt={anime?.animeId?.title?.english}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Rating */}
      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
        ⭐ {anime.rating}
      </div>

      {/* Title */}
      <h3 className="text-2xl border-b-2 border-red-900 text-center font-bold text-white mt-2 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
        {anime.animeId.title.english}
      </h3>

      {/* Episodes & totalEpisode */}
          <div className="block justify-between text-sm text-gray-400 mt-auto pb-3 rounded-2xl border border-red-900 w-full">
            <h3 className='text-lg font-bold p-2'>currently on :</h3>
            <span  className='text-md font-bold p-2'>{anime.currentEpisode} Episodes</span>
            <span  className='text-md font-bold'> /</span>
            <span  className='text-md font-bold p-2'>{anime.animeId.episodes} total Episode</span>
          </div>

      <button className='bg-red-500 ml-2'>Update Progess</button>
      <button className='bg-red-500 ml-2'>Edit</button>
      <button className='bg-red-500 ml-2'>Remove</button>
    </div>
  )
}

export default LibraryCard