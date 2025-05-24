// SongList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Reordering from './Reordering';

const SongList = ({ externalSongs, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    onDelete(id);
  };

  const handleReorder = (result) => {
    if (!result.destination) return;
    console.log('Reorder result:', result);
  };

  return (
    <div className="p-4">
      <Reordering
        songs={externalSongs}
        onDelete={handleDelete}
        onNavigate={(id) => navigate(`/songs/${id}`)}   
        onDragEnd={handleReorder}
      />
    </div>
  );
};

export default SongList;
