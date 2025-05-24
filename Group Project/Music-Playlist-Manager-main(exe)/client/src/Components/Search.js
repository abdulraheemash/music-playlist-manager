import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import './../input.css';

function SongSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full">

      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
        placeholder="Search by title or artist..."
        value={query}
        onChange={handleChange}
        style={{
          backgroundImage: "url('https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/search.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
      />
    </div>
  );
}

export default SongSearch;
