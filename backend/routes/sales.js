import express from 'express';
import { db } from '../server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get minimal price for product
function getProductCost(product_id) {
  return new Promise((resolve) => {
    db.get(
      `SELECT COALESCE(SUM(qty_in * buy_price_per_unit) + SUM(expense_total), 0) / COALESCE(SUM(qty_in), 1) as cost_per_unit
       FROM purchases WHERE product_id = ?`,
      [product_id],
      (err, row) => {
        resolve(row?.cost_per_unit || 0);
      }
    );
  });
}

// Create sale
router.post('/', verifyToken, async (req, res) => {
  const { items, customer_name, payment_type } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Mahsulot tanlang' });
  }

  // Validate items
  for (const item of items) {
    if (item.qty <= 0 || item.sell_price_per_unit <= 0) {
      return res.status(400).json({ error: 'Miqdor va narx to\'g\'ri emas' });
    }

    // Check minimal price
    const pricing = await new Promise((resolve) => {
      db.get('SELECT minimal_price_per_unit FROM pricing_rules WHERE product_id = ?', [item.product_id], (err, row) => {
        resolve(row);
      });
    });

    const costPrice = await getProductCost(item.product_id);
    const minimalPrice = pricing?.minimal_price_per_unit || costPrice;

    if (item.sell_price_per_unit < minimalPrice) {
      return res.status(400).json({
        error: `Mahsulot ${item.product_id} uchun eng past narx: ${minimalPrice} so'm`
      });
    }

    // Check stock
    const stock = await new Promise((resolve) => {
      db.get(
        `SELECT COALESCE(SUM(qty_in), 0) - COALESCE((SELECT SUM(qty) FROM sale_items WHERE product_id = ?), 0) as current_qty
         FROM purchases WHERE product_id = ?`,
        [item.product_id, item.product_id],
        (err, row) => {
          resolve(row?.current_qty || 0);
        }
      );
    });

    if (item.qty > stock) {
      return res.status(400).json({ error: `Yetarli mahsulot mavjud emas. Qoldiq: ${stock}` });
    }
  }

  // Create sale
  let totalSum = 0;
  let totalProfit = 0;
  const saleItems = [];

  for (const item of items) {
    const cost = await getProductCost(item.product_id);
    const lineTotal = item.qty * item.sell_price_per_unit;
    const lineProfit = item.qty * (item.sell_price_per_unit - cost);
    totalSum += lineTotal;
    totalProfit += lineProfit;
    saleItems.push({
      ...item,
      cost_price_per_unit_snapshot: cost,
      line_total: lineTotal,
      line_profit: lineProfit
    });
  }

  db.run(
    'INSERT INTO sales (seller_id, sold_at, customer_name, payment_type, total_sum, total_profit) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, new Date().toISOString(), customer_name || null, payment_type || null, totalSum, totalProfit],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Xato' });
      }

      const saleId = this.lastID;

      // Insert sale items
      saleItems.forEach((item) => {
        db.run(
          'INSERT INTO sale_items (sale_id, product_id, qty, sell_price_per_unit, cost_price_per_unit_snapshot, line_total, line_profit) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [saleId, item.product_id, item.qty, item.sell_price_per_unit, item.cost_price_per_unit_snapshot, item.line_total, item.line_profit]
        );
      });

      // If seller, do not return profit numbers
      const hideProfit = req.user?.role !== 'manager';
      const resp = { id: saleId, total_sum: totalSum, items: saleItems };
      if (!hideProfit) {
        resp.total_profit = totalProfit;
      } else {
        // remove profit fields from items
        resp.items = saleItems.map((it) => {
          const copy = { ...it };
          delete copy.line_profit;
          delete copy.cost_price_per_unit_snapshot; // hide cost snapshot from sellers
          return copy;
        });
      }

      res.json(resp);
    }
  );
});

// Get sales
router.get('/', verifyToken, (req, res) => {
  const { start_date, end_date, seller_id } = req.query;

  let query = `SELECT s.*, u.name as seller_name FROM sales s
               JOIN users u ON s.seller_id = u.id WHERE 1=1`;
  const params = [];

  if (start_date) {
    query += ` AND DATE(s.sold_at) >= DATE(?)`;
    params.push(start_date);
  }

  if (end_date) {
    query += ` AND DATE(s.sold_at) <= DATE(?)`;
    params.push(end_date);
  }

  if (seller_id) {
    query += ` AND s.seller_id = ?`;
    params.push(seller_id);
  }

  query += ` ORDER BY s.sold_at DESC`;

    db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Server xatosi' });
    }
    // hide total_profit for sellers
    const hideProfit = req.user?.role !== 'manager';
    if (hideProfit) {
      const filtered = (rows || []).map((r) => {
        const copy = { ...r };
        delete copy.total_profit;
        return copy;
      });
      return res.json(filtered);
    }
    res.json(rows || []);
  });
});

// Get sale details
router.get('/:id', verifyToken, (req, res) => {
  db.get('SELECT * FROM sales WHERE id = ?', [req.params.id], (err, sale) => {
    if (err || !sale) {
      return res.status(404).json({ error: 'Sotuvni topilmadi' });
    }

    db.all(
      `SELECT si.*, p.name, p.unit FROM sale_items si
       JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = ?`,
      [req.params.id],
      (err, items) => {
        if (err) {
          return res.status(500).json({ error: 'Server xatosi' });
        }
        const hideProfit = req.user?.role !== 'manager';
        const itemsFiltered = (items || []).map((it) => {
          const copy = { ...it };
          if (hideProfit) {
            delete copy.line_profit;
            delete copy.cost_price_per_unit_snapshot;
          }
          return copy;
        });

        const saleResp = { ...sale, items: itemsFiltered };
        if (hideProfit) delete saleResp.total_profit;

        res.json(saleResp);
      }
    );
  });
});

export default router;
