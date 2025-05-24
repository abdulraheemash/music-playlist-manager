require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all songs
app.get('/songs', (req, res) => {
  db.query('SELECT * FROM songs ORDER BY position ASC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch songs' });
    res.status(200).json(results);
  });
});

// POST new song
app.post('/songs', (req, res) => {
  const { title, artist, genre, duration } = req.body;
  if (!title || !artist || !genre || !duration) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('SELECT MAX(position) AS maxPos FROM songs', (err, maxResults) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch max position' });

    const nextPosition = (maxResults[0].maxPos || 0) + 1;

    db.query(
      'INSERT INTO songs (title, artist, genre, duration, position) VALUES (?, ?, ?, ?, ?)',
      [title, artist, genre, duration, nextPosition],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add song' });

        res.status(201).json({
          id: result.insertId,
          title,
          artist,
          genre,
          duration,
          position: nextPosition,
        });
      }
    );
  });
});

// DELETE a song by ID
app.delete('/songs/:id', (req, res) => {
  db.query('DELETE FROM songs WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete song' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json({ message: 'Song deleted successfully' });
  });
});

// PUT reorder songs
app.put('/songs/reorder', (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Invalid order format' });
  }

  const updates = order.map(({ id, position }) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE songs SET position = ? WHERE id = ?', [position, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(updates)
    .then(() => res.status(200).json({ message: 'Order updated successfully' }))
    .catch((err) => {
      console.error('Error updating order:', err);
      res.status(500).json({ error: 'Failed to update order' });
    });
});

// GET songs by genre
app.get('/api/music', (req, res) => {
  const { genre } = req.query;
  if (!genre || genre === 'Select Genre') return res.json([]);

  db.query('SELECT * FROM songs WHERE genre = ?', [genre], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch music' });
    res.json(results);
  });
});

// GET song by ID
app.get('/songs/:id', (req, res) => {
  const songId = req.params.id;
  db.query('SELECT * FROM songs WHERE id = ?', [songId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    if (results.length === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json(results[0]);
  });
});

// PUT update song by ID
app.put('/songs/:id', (req, res) => {
  const { id } = req.params;
  const { title, artist, genre, duration } = req.body;

  if (!title || !artist || !genre || !duration || duration <= 0) {
    return res.status(400).json({ error: 'Please provide valid title, artist, genre and duration' });
  }

  db.query('SELECT * FROM songs WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    if (results.length === 0) return res.status(404).json({ error: 'Song not found' });

    db.query(
      'UPDATE songs SET title = ?, artist = ?, genre = ?, duration = ? WHERE id = ?',
      [title, artist, genre, duration, id],
      (err) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });

        db.query('SELECT * FROM songs WHERE id = ?', [id], (err, updatedResults) => {
          if (err) return res.status(500).json({ error: 'Internal Server Error' });
          res.json(updatedResults[0]);
        });
      }
    );
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎵 Server running at http://localhost:${PORT}`);
});
