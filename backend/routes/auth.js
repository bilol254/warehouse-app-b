import express from 'express';
import bcryptjs from 'bcryptjs';
import { db } from '../server.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', (req, res) => {
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
        return res.status(500).json({ error: 'Registratsiya xatosi' });
      }

      const user = { id: this.lastID, name, username, role };
      const token = generateToken(user);
      res.json({ user, token });
    }
  );
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Foydalanuvchi nomi va parol kiritilsin' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server xatosi' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    }

    const isValid = bcryptjs.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Parol noto\'g\'ri' });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
      token
    });
  });
});

router.get('/me', verifyToken, (req, res) => {
  db.get('SELECT id, name, username, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
    res.json(user);
  });
});

export default router;
