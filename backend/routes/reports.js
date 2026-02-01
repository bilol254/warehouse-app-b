import express from 'express';
import { db } from '../server.js';
import { verifyToken, verifyManager } from '../middleware/auth.js';

const router = express.Router();

// Get reports/stats
router.get('/dashboard', verifyToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  // Today's stats
  db.get(
    `SELECT 
      COUNT(*) as sales_count, 
      COALESCE(SUM(total_sum), 0) as total_revenue,
      COALESCE(SUM(total_profit), 0) as total_profit
     FROM sales WHERE DATE(sold_at) = ?`,
    [today],
    (err, todayStats) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }

      // Top products today
      db.all(
        `SELECT p.id, p.name, SUM(si.qty) as qty_sold, SUM(si.line_total) as revenue
         FROM sale_items si
         JOIN sales s ON si.sale_id = s.id
         JOIN products p ON si.product_id = p.id
         WHERE DATE(s.sold_at) = ?
         GROUP BY p.id
         ORDER BY qty_sold DESC
         LIMIT 5`,
        [today],
        (err, topProducts) => {
          if (err) {
            return res.status(500).json({ error: 'Server xatosi' });
          }

          const hideProfit = req.user?.role !== 'manager';
          const statsResp = todayStats || { sales_count: 0, total_revenue: 0, total_profit: 0 };
          if (hideProfit) {
            delete statsResp.total_profit;
          }
          const topProductsResp = (topProducts || []).map((p) => {
            const copy = { ...p };
            if (hideProfit) delete copy.revenue; // keep revenue but remove profit-sensitive fields if any
            return copy;
          });

          res.json({ today_stats: statsResp, top_products: topProductsResp });
        }
      );
    }
  );
});

// Get stock summary
router.get('/stock-summary', verifyToken, (req, res) => {
  db.all(
    `SELECT p.id, p.name, p.sku,
      COALESCE(SUM(pur.qty_in), 0) - COALESCE((SELECT SUM(si.qty) FROM sale_items si WHERE si.product_id = p.id), 0) as current_qty,
      pr.minimal_price_per_unit, pr.recommended_price_per_unit
     FROM products p
     LEFT JOIN purchases pur ON p.id = pur.product_id
     LEFT JOIN pricing_rules pr ON p.id = pr.product_id
     WHERE p.is_active = 1
     GROUP BY p.id
     ORDER BY current_qty DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }
      res.json(rows || []);
    }
  );
});

// Get period report
router.get('/period', verifyToken, (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Sanalarni kiriting' });
  }

  db.get(
    `SELECT 
      COUNT(DISTINCT s.id) as sales_count,
      COALESCE(SUM(s.total_sum), 0) as total_revenue,
      COALESCE(SUM(s.total_profit), 0) as total_profit,
      COALESCE(SUM(si.qty), 0) as total_qty_sold
     FROM sales s
     LEFT JOIN sale_items si ON s.id = si.sale_id
     WHERE DATE(s.sold_at) BETWEEN ? AND ?`,
    [start_date, end_date],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Server xatosi' });
      }

      db.all(
        `SELECT p.id, p.name, SUM(si.qty) as qty_sold, SUM(si.line_total) as revenue, SUM(si.line_profit) as profit
         FROM sale_items si
         JOIN sales s ON si.sale_id = s.id
         JOIN products p ON si.product_id = p.id
         WHERE DATE(s.sold_at) BETWEEN ? AND ?
         GROUP BY p.id
         ORDER BY revenue DESC`,
        [start_date, end_date],
        (err, products) => {
          if (err) {
            return res.status(500).json({ error: 'Server xatosi' });
          }

          const hideProfit = req.user?.role !== 'manager';
          const statsResp = stats || { sales_count: 0, total_revenue: 0, total_profit: 0, total_qty_sold: 0 };
          if (hideProfit) delete statsResp.total_profit;
          const productsResp = (products || []).map((p) => {
            const copy = { ...p };
            if (hideProfit) delete copy.profit;
            return copy;
          });
          res.json({ stats: statsResp, products: productsResp });
        }
      );
    }
  );
});

export default router;
