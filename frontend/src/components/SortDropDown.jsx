function SortDropDown({sortBy, onChange}) {
  return (
    <div className="flex items-center justify-end text-red-600 mb-3 sm:mb-4">
      <label className="text-gray-400 text-sm mr-2 hidden sm:inline">Sort by:</label>
      <select
        value={sortBy}
        onChange={onChange}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 font-bold text-sm sm:text-base cursor-pointer hover:border-red-600 transition-colors w-full sm:w-auto">
        <option value="recent">Recently Updated</option>
        <option value="title-asc">Title A–Z</option>
        <option value="title-desc">Title Z–A</option>
        <option value="rating-high">Rating High → Low</option>
        <option value="rating-low">Rating Low → High</option>
        <option value="progress">Progress</option>
      </select>
    </div>
  )
}

export default SortDropDown