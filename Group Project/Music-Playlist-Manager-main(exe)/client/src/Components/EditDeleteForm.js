import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

const genreOptions = [
  { value: 'Rock', label: 'Rock' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'Classical', label: 'Classical' },
  { value: 'Other', label: 'Other' },
];

const EditDeleteForm = () => {
  const { id: songId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    artist: '',
    genre: '',
    duration: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/songs/${songId}`)
      .then(res => {
        const song = res.data;
        setForm({
          title: song.title,
          artist: song.artist,
          genre: song.genre,
          duration: song.duration
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to fetch song details');
        setLoading(false);
      });
  }, [songId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (selectedOption) => {
    setForm(prev => ({ ...prev, genre: selectedOption.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, artist, genre, duration } = form;
    if (!title || !artist || !genre || !duration || duration <= 0) {
      return toast.error('Please fill all fields correctly');
    }

    axios.put(`http://localhost:5000/songs/${songId}`, form)
      .then(() => {
        toast.success('Song updated successfully');
        setTimeout(() => {
          navigate(`/songs/${songId}`);
        }, 1000);
      })
      .catch(() => toast.error('Failed to update song'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-purple-500 py-10 text-lg font-semibold">
          Loading song data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-500 p-6 flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">Edit Song Details</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
              Artist
            </label>
            <input
              id="artist"
              name="artist"
              type="text"
              value={form.artist}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <Select
              inputId="genre"
              value={genreOptions.find(opt => opt.value === form.genre)}
              onChange={handleGenreChange}
              options={genreOptions}
              className="text-sm"
              aria-label="Select genre"
              aria-required="true"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  borderColor: '#D1D5DB',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#A78BFA'
                  }
                }),
              }}
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={form.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              required
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-medium transition duration-200"
              aria-label="Save changes"
            >
              Save Changes
            </button>
            <button
  type="button"
  onClick={() => navigate(`/songs/${songId}`)}
  className="ml-4 bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium transition duration-200"
  aria-label="Cancel and return"
>
  Cancel
</button>

            
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeleteForm;