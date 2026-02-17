import { useState,useEffect, useMemo } from "react";
import {debounce} from "lodash";

// Why use local state instead of parent state directly?
// Local state handles fast UI updates while parent state handles expensive operations like API calls.
function SearchBar({onSearch, initialValue=""}) {
  const [input, setInput] = useState(initialValue); //Stores current text in input.

  //METHOD 1:
  // Debounce search - wait 500ms after user stops typing
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onSearch(query);
  //   }, 500);

  //   // Cleanup: cancel timer if user types again
  //   return () => clearTimeout(timer);   // This runs BEFORE next effect.
  // }, [query, onSearch])

  // METHOD 2:
  // Create debounced version of onSearch
  const debouncedSearch = useMemo(() => {
    return debounce((value) => {
      onSearch(value);
    }, 500);
  }, [onSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-black ">
      <input
      type="text"
      placeholder="Search what excites..."
      value={input}
      onChange={handleChange}
      className="w-full bg-gray-900 border focus:outline-none focus:border-red-600 transition-colors p-4 rounded-xl"/>
    </div>
  )
}

export default SearchBar;