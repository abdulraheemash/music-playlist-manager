import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import '../output.css';



const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios
      .get(`http://localhost:5000/songs/${id}`)
      .then((res) => {
        setSong(res.data);
        setLoading(false);
        simulatePlayback(res.data.duration);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Animate progress bar over song duration (in seconds)
  const simulatePlayback = (duration) => {
    setProgress(0);
    let start = 0;
    const totalDurationMs = duration * 1000; // convert seconds to ms
    const stepTime = 50; // update every 50ms
    const increments = totalDurationMs / stepTime;

    const interval = setInterval(() => {
      start += 1;
      setProgress((start / increments) * 100);
      if (start >= increments) clearInterval(interval);
    }, stepTime);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/songs/${id}`)
      .then(() => {
        toast.success("Song deleted");
        navigate("/");
      })
      .catch(() => toast.error("Failed to delete song"));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <p className="text-xl font-semibold text-purple-700 mb-4">
          Song not found
        </p>
        <Link
          to="/"
          className="text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 rounded px-5 py-2 focus:outline-none transition"
        >
          Back to Songs
        </Link>
      </div>
    );

  return (
    <div className="bg-purple-500 min-h-screen flex justify-center items-center p-6">
        
            <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full flex flex-col space-y-4"
      style={{ maxHeight: "90vh", overflowY: "auto" }} // optional for taller content
      >
        <h1 className="text-3xl font-bold text-purple-700">{song.title}</h1>
        <p className="text-gray-700">
          <span className="font-semibold">Artist:</span> {song.artist}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Genre:</span> {song.genre}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Duration:</span>{" "}
          {Math.floor(song.duration / 60)}:
          {String(song.duration % 60).padStart(2, "0")}
        </p>

        {/* Playback progress */}
        <div>
          <label
            htmlFor="playback-progress"
            className="block mb-2 font-semibold text-gray-600"
          >
            Playback Progress
          </label>
          <div
            id="playback-progress"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="w-full h-4 bg-purple-200 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between sm:space-x-4 space-y-3 sm:space-y-0">
  <Link
    to={`/edit/${song.id}`}
    className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-4 py-2 text-center cursor-pointer"
  >
    Edit Song
  </Link>

  <Link
    as="button"
    onClick={(e) => {
      e.preventDefault();
      handleDelete();
    }}
    to="#"
    className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-4 py-2 cursor-pointer"
  >
    Delete Song
  </Link>
</div>


        {/* Back link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-purple-600 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
          >
            &larr; Back to Songs
          </Link>
        </div>
      </motion.div>
        

      
    </div>
  );
};

export default SongDetails;