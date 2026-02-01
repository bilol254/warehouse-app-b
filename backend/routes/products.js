import express from 'express';
import { db } from '../server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all products with current stock
router.get('/', verifyToken, (req, res) => {
  db.all(
    `SELECT p.*, 
      COALESCE(SUM(pur.qty_in), 0) - COALESCE((SELECT SUM(si.qty) FROM sale_items si WHERE si.product_id = p.id), 0) as current_qty,
      pr.minimal_price_per_unit, pr.recommended_price_per_unit, pr.promo_type, pr.promo_value, pr.promo_start, pr.promo_end
     FROM products p
     LEFT JOIN purchases pur ON p.id = pur.product_id
     LEFT JOIN pricing_rules pr ON p.id = pr.product_id
     WHERE p.is_active = 1
     GROUP BY p.id`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }
      res.json(rows || []);
    }
  );
});

// Get single product with stock
router.get('/:id', verifyToken, (req, res) => {
  const productId = req.params.id;

  db.get(
    `SELECT p.*, 
      COALESCE(SUM(pur.qty_in), 0) - COALESCE((SELECT SUM(si.qty) FROM sale_items si WHERE si.product_id = p.id), 0) as current_qty,
      pr.minimal_price_per_unit, pr.recommended_price_per_unit, pr.promo_type, pr.promo_value, pr.promo_start, pr.promo_end
     FROM products p
     LEFT JOIN purchases pur ON p.id = pur.product_id
     LEFT JOIN pricing_rules pr ON p.id = pr.product_id
     WHERE p.id = ? AND p.is_active = 1
     GROUP BY p.id`,
    [productId],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Mahsulot topilmadi' });
      }
      res.json(row);
    }
  );
});

// Create product (manager only)
router.post('/', verifyToken, (req, res) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Faqat menejer mahsulot yaratishi mumkin' });
  }

  const { sku, name, category, unit } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Mahsulot nomi kerak' });
  }

  db.run(
    'INSERT INTO products (sku, name, category, unit, is_active) VALUES (?, ?, ?, ?, 1)',
    [sku || null, name, category || null, unit || 'pcs'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Xato' });
      }

      // Create default pricing rule
      db.run(
        'INSERT INTO pricing_rules (product_id, minimal_price_per_unit, recommended_price_per_unit) VALUES (?, ?, ?)',
        [this.lastID, 0, 0]
      );

      res.json({ id: this.lastID, sku, name, category, unit: unit || 'pcs' });
    }
  );
});

// Search products
router.get('/search/:query', verifyToken, (req, res) => {
  const query = `%${req.params.query}%`;

  db.all(
    `SELECT p.*, 
      COALESCE(SUM(pur.qty_in), 0) - COALESCE((SELECT SUM(si.qty) FROM sale_items si WHERE si.product_id = p.id), 0) as current_qty
     FROM products p
     LEFT JOIN purchases pur ON p.id = pur.product_id
     WHERE p.is_active = 1 AND (p.name LIKE ? OR p.sku LIKE ?)
     GROUP BY p.id
     LIMIT 20`,
    [query, query],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }
      res.json(rows || []);
    }
  );
});

export default router;
