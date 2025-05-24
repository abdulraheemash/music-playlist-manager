
// Filter.jsx
import React, { useState } from "react";

const genres = ["Select Genre", "Rock", "Pop", "Jazz", "Classical", "other"];

const MusicFilter = ({ onGenreChange }) => {
  const [selectedGenre, setSelectedGenre] = useState("Select Genre");

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onGenreChange(genre);
  };

  return (
    <select
      className="w-full px-4 py-2 border border-purple-300 rounded bg-purple-100 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={selectedGenre}
      onChange={handleGenreChange}
    >
      {genres.map((genre) => (
        <option key={genre}>{genre}</option>
      ))}
    </select>
  );
};

export default MusicFilter;