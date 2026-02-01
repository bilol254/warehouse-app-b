import express from 'express';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Add purchase (manager and seller)
router.post('/', verifyToken, (req, res) => {
  const { product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note } = req.body;

  if (!product_id || !qty_in || buy_price_per_unit === undefined) {
    return res.status(400).json({ error: 'Zarur maydonlarni to\'ldiring' });
  }

  db.run(
    'INSERT INTO purchases (product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note) VALUES (?, ?, ?, ?, ?, ?)',
    [product_id, qty_in, buy_price_per_unit, expense_total || 0, arrived_at || new Date().toISOString(), note || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Xato' });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get purchases
router.get('/', verifyToken, (req, res) => {
  db.all(
    `SELECT p.*, pr.name, pr.sku FROM purchases p
     JOIN products pr ON p.product_id = pr.id
     ORDER BY p.arrived_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }
      res.json(rows || []);
    }
  );
});

// Get purchases for specific product
router.get('/product/:product_id', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM purchases WHERE product_id = ? ORDER BY arrived_at DESC',
    [req.params.product_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }
      res.json(rows || []);
    }
  );
});

export default router;
