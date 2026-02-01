import express from 'express';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Create debt
router.post('/', verifyToken, (req, res) => {
  const userId = req.user?.id;
  const { customer_name, phone, given_at, due_date, amount, note } = req.body;
  if (!customer_name || !phone || !given_at || !due_date || !amount) return res.status(400).json({ error: 'Kerakli maydonlar yetishmayapti' });
  if (String(phone).length < 9) return res.status(400).json({ error: 'Phone format kamida 9 belgi' });

  db.run(
    'INSERT INTO debts (created_by_user_id, customer_name, phone, given_at, due_date, amount, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId || null, customer_name, phone, given_at, due_date, amount, note || null],
    function (err) {
      if (err) return res.status(500).json({ error: 'Xato' });
      res.json({ id: this.lastID });
    }
  );
});

// List debts with filters
router.get('/', verifyToken, (req, res) => {
  const { status, from, to, due_from, due_to, search } = req.query;
  let where = [];
  let params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (from) { where.push('date(given_at) >= date(?)'); params.push(from); }
  if (to) { where.push('date(given_at) <= date(?)'); params.push(to); }
  if (due_from) { where.push('date(due_date) >= date(?)'); params.push(due_from); }
  if (due_to) { where.push('date(due_date) <= date(?)'); params.push(due_to); }
  if (search) { where.push('(customer_name LIKE ? OR phone LIKE ?)'); params.push('%' + search + '%', '%' + search + '%'); }

  const q = `SELECT * FROM debts ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
  db.all(q, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server xatosi' });
    res.json(rows || []);
  });
});

// Pay debt
router.post('/:id/pay', verifyToken, (req, res) => {
  const id = req.params.id;
  const { paid_amount } = req.body;
  if (!paid_amount) return res.status(400).json({ error: 'paid_amount kerak' });
  const paid_at = new Date().toISOString();
  db.run('UPDATE debts SET status = ?, paid_at = ?, paid_amount = ? WHERE id = ?', ['paid', paid_at, paid_amount, id], function (err) {
    if (err) return res.status(500).json({ error: 'Xato' });
    res.json({ updated: this.changes });
  });
});

// Edit (manager only)
router.put('/:id', verifyToken, verifyManager, (req, res) => {
  const id = req.params.id;
  const { customer_name, phone, given_at, due_date, amount, note, status } = req.body;
  db.run('UPDATE debts SET customer_name = ?, phone = ?, given_at = ?, due_date = ?, amount = ?, note = ?, status = ? WHERE id = ?', [customer_name, phone, given_at, due_date, amount, note, status || 'open', id], function (err) {
    if (err) return res.status(500).json({ error: 'Xato' });
    res.json({ updated: this.changes });
  });
});

// Delete (manager only)
router.delete('/:id', verifyToken, verifyManager, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM debts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Xato' });
    res.json({ deleted: this.changes });
  });
});

export default router;
