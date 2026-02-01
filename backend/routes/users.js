import express from 'express';
import bcryptjs from 'bcryptjs';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Get all users (manager only)
router.get('/', verifyToken, verifyManager, (req, res) => {
  db.all('SELECT id, name, username, role, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Server xatosi' });
    }
    res.json(rows || []);
  });
});

// Create user (manager only)
router.post('/', verifyToken, verifyManager, (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
  }

  if (!['manager', 'seller'].includes(role)) {
    return res.status(400).json({ error: 'Rol noto\'g\'ri' });
  }

  const passwordHash = bcryptjs.hashSync(password, 10);

  db.run(
    'INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, username, passwordHash, role],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Foydalanuvchi nomi allaqachon mavjud' });
        }
        return res.status(500).json({ error: 'Xato' });
      }
      res.json({ id: this.lastID, name, username, role });
    }
  );
});

// Delete user (manager only)
router.delete('/:id', verifyToken, verifyManager, (req, res) => {
  const userId = req.params.id;

  if (userId == req.user.id) {
    return res.status(400).json({ error: 'O\'zingizni o\'chira olmaysiz' });
  }

  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Xato' });
    }
    res.json({ success: true });
  });
});

export default router;
