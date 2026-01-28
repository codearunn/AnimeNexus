import { useState, useEffect } from "react";

// Why use local state instead of parent state directly?
// Local state handles fast UI updates while parent state handles expensive operations like API calls.
function SearchBar({onSearch, initialValue=""}) {
  const [query, setQuery] = useState(initialValue); //Stores current text in input.

  // Debounce search - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500);

    // Cleanup: cancel timer if user types again
    return () => clearTimeout(timer);   // This runs BEFORE next effect.
  }, [query, onSearch])


  return (
    <div className="bg-black ">
      <input
      type="text"
      placeholder="Search what excites..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="w-full bg-gray-900 border focus:outline-none focus:border-red-600 transition-colors p-4 rounded-xl"/>
    </div>
  )
}

export default SearchBar;