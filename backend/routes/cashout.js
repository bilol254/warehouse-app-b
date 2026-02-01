import express from 'express';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Create cash out
router.post('/', verifyToken, (req, res) => {
  const userId = req.user?.id;
  const { receiver_name, amount, taken_at, note } = req.body;
  if (!receiver_name || !amount || !taken_at) return res.status(400).json({ error: 'receiver_name, amount, taken_at kerak' });

  db.run('INSERT INTO cash_out (created_by_user_id, receiver_name, amount, taken_at, note) VALUES (?, ?, ?, ?, ?)', [userId || null, receiver_name, amount, taken_at, note || null], function (err) {
    if (err) return res.status(500).json({ error: 'Xato yozishda' });
    res.json({ id: this.lastID });
  });
});

// List cashouts with simple filters
router.get('/', verifyToken, (req, res) => {
  const { from, to, receiver } = req.query;
  let where = [];
  let params = [];
  if (from) { where.push('date(taken_at) >= date(?)'); params.push(from); }
  if (to) { where.push('date(taken_at) <= date(?)'); params.push(to); }
  if (receiver) { where.push('receiver_name LIKE ?'); params.push(`%${receiver}%`); }
  const q = `SELECT * FROM cash_out ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY taken_at DESC`;
  db.all(q, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server xatosi' });
    res.json(rows || []);
  });
});

// Manager-only delete
router.delete('/:id', verifyToken, verifyManager, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cash_out WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Xato' });
    res.json({ deleted: this.changes });
  });
});

// Manager-only update
router.put('/:id', verifyToken, verifyManager, (req, res) => {
  const id = req.params.id;
  const { receiver_name, amount, taken_at, note } = req.body;
  db.run('UPDATE cash_out SET receiver_name = ?, amount = ?, taken_at = ?, note = ? WHERE id = ?', [receiver_name, amount, taken_at, note, id], function (err) {
    if (err) return res.status(500).json({ error: 'Xato' });
    res.json({ updated: this.changes });
  });
});

export default router;
