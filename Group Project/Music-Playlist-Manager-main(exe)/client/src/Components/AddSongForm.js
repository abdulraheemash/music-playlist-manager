
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';

function AddSongForm({ isOpen, onClose }) {
  const [form, setForm] = useState({
    title: '',
    artist: '',
    genre: '',
    duration: ''
  });

  const [errors, setErrors] = useState({});

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle input change & live validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const updatedErrors = validate(updatedForm);
    setErrors(updatedErrors);
  };

  // Validation
  const validate = (data) => {
    const err = {};
    if (!data.title.trim()) err.title = 'Title is required';
    if (!data.artist.trim()) err.artist = 'Artist is required';
    if (!data.genre) err.genre = 'Genre is required';
    if (!data.duration || data.duration <= 0) err.duration = 'Duration must be > 0';
    return err;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:5000/songs', form);
      toast.success('Song added successfully!');
      setForm({ title: '', artist: '', genre: '', duration: '' });
      onClose();
    } catch (err) {
      toast.error('Failed to add song');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <FocusTrap>
              <motion.div
                className="bg-white p-8 rounded-xl max-w-md w-full shadow-lg font-sans"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <h2 className="mb-6 text-purple-700 text-2xl font-semibold">Add New Song</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <label className="block mb-4">
                    <span className="sr-only">Title</span>
                    <input
                      name="title"
                      aria-label="Song Title"
                      placeholder="Title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className={`block w-full p-2 mb-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black bg-white ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}
                  </label>

                  <label className="block mb-4">
                    <span className="sr-only">Artist</span>
                    <input
                      name="artist"
                      aria-label="Artist"
                      placeholder="Artist"
                      value={form.artist}
                      onChange={handleChange}
                      required
                      className={`block w-full p-2 mb-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black bg-white ${
                        errors.artist ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.artist && <div className="text-red-600 text-sm">{errors.artist}</div>}
                  </label>

                  <label className="block mb-4">
                    <span className="sr-only">Genre</span>
                    <select
                      name="genre"
                      aria-label="Genre"
                      value={form.genre}
                      onChange={handleChange}
                      required
                      className={`block w-full p-2 mb-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black bg-white ${
                        errors.genre ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Genre</option>
                      <option value="Rock">Rock</option>
                      <option value="Pop">Pop</option>
                      <option value="Jazz">Jazz</option>
                      <option value="Classical">Classical</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.genre && <div className="text-red-600 text-sm">{errors.genre}</div>}
                  </label>

                  <label className="block mb-4">
                    <span className="sr-only">Duration</span>
                    <input
                      name="duration"
                      type="number"
                      aria-label="Duration"
                      placeholder="Duration (seconds)"
                      value={form.duration}
                      onChange={handleChange}
                      required
                      className={`block w-full p-2 mb-1 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black bg-white ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.duration && <div className="text-red-600 text-sm">{errors.duration}</div>}
                  </label>

                  <div className="flex justify-between mt-4">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </FocusTrap>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddSongForm;
