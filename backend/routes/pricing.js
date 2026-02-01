import express from 'express';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Get pricing rules
router.get('/:product_id', verifyToken, (req, res) => {
  db.get('SELECT * FROM pricing_rules WHERE product_id = ?', [req.params.product_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Server xatosi' });
    }
    res.json(row || { product_id: req.params.product_id, minimal_price_per_unit: 0, recommended_price_per_unit: 0 });
  });
});

// Update pricing rules (manager only)
router.put('/:product_id', verifyToken, verifyManager, (req, res) => {
  const { minimal_price_per_unit, recommended_price_per_unit, promo_type, promo_value, promo_start, promo_end } = req.body;

  const product_id = req.params.product_id;

  db.run(
    `UPDATE pricing_rules 
     SET minimal_price_per_unit = ?, recommended_price_per_unit = ?, promo_type = ?, promo_value = ?, promo_start = ?, promo_end = ?
     WHERE product_id = ?`,
    [minimal_price_per_unit || 0, recommended_price_per_unit || 0, promo_type || null, promo_value || null, promo_start || null, promo_end || null, product_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Xato' });
      }
      res.json({ success: true });
    }
  );
});

export default router;
