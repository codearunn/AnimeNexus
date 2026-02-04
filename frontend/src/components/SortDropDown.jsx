function SortDropDown({sortBy, onChange}) {
  return (
    <div className="flex items-center  text-red-600 mb-2">
      <select
        value={sortBy}
        onChange={onChange}
        className="bg-black rounded-xl p-2 font-extrabold text-xl cursor-pointer shadow-md hover:shadow-red-900 ml-auto">
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