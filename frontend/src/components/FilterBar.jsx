import { useState, useEffect } from "react";

function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  selectedStatus,
  onStatusChange
}) {
  const statuses = ["airing", "completed", "upcoming"];
  
  // Local state for debouncing
  const [localGenre, setLocalGenre] = useState(selectedGenre);
  const [localStatus, setLocalStatus] = useState(selectedStatus);

  // Debounce genre changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onGenreChange(localGenre);
    }, 500);
    return () => clearTimeout(timer);
  }, [localGenre, onGenreChange]);

  // Debounce status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onStatusChange(localStatus);
    }, 500);
    return () => clearTimeout(timer);
  }, [localStatus, onStatusChange]);

  // Sync with parent when parent changes externally
  useEffect(() => {
    setLocalGenre(selectedGenre);
  }, [selectedGenre]);

  useEffect(() => {
    setLocalStatus(selectedStatus);
  }, [selectedStatus]);

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      {/* Genre Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-400 text-sm mb-2">Genre</label>
        <select
          value={localGenre}
          onChange={(e) => setLocalGenre(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700
                     rounded-lg text-white focus:outline-none focus:border-red-600"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-gray-400 text-sm mb-2">Status</label>
        <select
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700
                     rounded-lg text-white focus:outline-none focus:border-red-600"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-end">
        <button
          onClick={() => {
            setLocalGenre("");
            setLocalStatus("");
            onGenreChange("");
            onStatusChange("");
          }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white
                     font-bold rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
