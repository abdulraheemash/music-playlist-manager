import React, { useEffect, useState } from 'react';
import '../output.css';
import SongList from '../Components/SongList';
import toast, { Toaster } from 'react-hot-toast';
import AddSongForm from '../Components/AddSongForm';
import MusicFilter from '../Components/Filter';
import SongSearch from '../Components/Search';
import axios from 'axios';

function HomePageComponent() {
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSongs = () => {
    axios
      .get('http://localhost:5000/songs')
      .then((response) => {
        const sorted = response.data.sort((a, b) => a.position - b.position);
        setAllSongs(sorted);
        setFilteredSongs(sorted);
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
        toast.error('Failed to load songs');
      });
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    let songs = [...allSongs];
    if (genreFilter && genreFilter !== 'Select Genre') {
      songs = songs.filter((song) => song.genre === genreFilter);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      songs = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }
    setFilteredSongs(songs);
  }, [genreFilter, searchTerm, allSongs]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/songs/${id}`)
      .then(() => {
        setAllSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
        toast.success('Song deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting song:', error);
        toast.error('Failed to delete song');
      });
  };

  const handleAddSong = (newSong) => {
    setAllSongs((prevSongs) => {
      const updatedSongs = [...prevSongs, newSong];
      return updatedSongs.sort((a, b) => a.position - b.position);
    });
    toast.success('Song added successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Toaster />
      <header className="bg-purple-600 text-white py-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Music Playlist</h1>
          <button
            className="ml-auto bg-purple-500 text-white px-4 py-2 rounded border-2 border-transparent focus:outline-none"
            onClick={() => setModalOpen(true)}
          >
            Add Song
          </button>
          <AddSongForm
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onAdd={handleAddSong}
          />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
       <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
  <div className="w-full md:flex-1">
    <SongSearch onSearch={setSearchTerm} />
  </div>
  <div className="w-full md:w-1/3">
    <MusicFilter onGenreChange={setGenreFilter} />
  </div>
</div>


        <div className="grid gap-6">
          <SongList externalSongs={filteredSongs} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}

export default HomePageComponent;
