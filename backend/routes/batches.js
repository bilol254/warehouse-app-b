import express from 'express';
import { db } from '../server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create batch
router.post('/', verifyToken, (req, res) => {
  const userId = req.user?.id;
  const { supplier_name, note, total_tons, price_per_ton, products, expenses } = req.body;

  if (!total_tons || !price_per_ton) return res.status(400).json({ error: 'total_tons va price_per_ton kerak' });
  if (!Array.isArray(products) || products.length === 0) return res.status(400).json({ error: 'Kamida 1 mahsulot kerak' });

  const base_total_sum = Number(total_tons) * Number(price_per_ton);

  db.run(
    'INSERT INTO incoming_batches (created_by_user_id, supplier_name, note, total_tons, price_per_ton, base_total_sum) VALUES (?, ?, ?, ?, ?, ?)',
    [userId || null, supplier_name || null, note || null, total_tons, price_per_ton, base_total_sum],
    function (err) {
      if (err) return res.status(500).json({ error: 'Xato batch yaratishda' });

      const batchId = this.lastID;

      // insert expenses
      const expensesTotal = Array.isArray(expenses)
        ? expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
        : 0;

      if (Array.isArray(expenses)) {
        const stmtExp = db.prepare('INSERT INTO batch_expenses (batch_id, amount, comment) VALUES (?, ?, ?)');
        expenses.forEach((ex) => {
          stmtExp.run(batchId, ex.amount || 0, ex.comment || null);
        });
        stmtExp.finalize();
      }

      // compute total meters sum
      let totalMetersAll = 0;
      const computedProducts = products.map((p) => {
        const qty = Number(p.qty_pcs || 0);
        const defaultLen = Number(p.default_piece_length_m || 0);
        const extra = Array.isArray(p.piece_lengths_list) ? p.piece_lengths_list.map(Number) : [];
        const extraSum = extra.reduce((s, v) => s + (v || 0), 0);
        const total_meters = qty * defaultLen + extraSum;
        totalMetersAll += total_meters;
        return { ...p, qty, defaultLen, extra, total_meters };
      });

      // allocate costs
      const stmtProd = db.prepare(
        `INSERT INTO batch_products (batch_id, product_id, qty_pcs, piece_lengths_json, default_piece_length_m, total_meters, allocated_tons, allocated_base_sum, allocated_expenses_sum, total_cost_sum, cost_per_ton, cost_per_meter, cost_per_piece)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      computedProducts.forEach((cp) => {
        const share = totalMetersAll > 0 ? cp.total_meters / totalMetersAll : 0;
        const allocated_base_sum = share * base_total_sum;
        const allocated_expenses_sum = share * expensesTotal;
        const total_cost_sum = allocated_base_sum + allocated_expenses_sum;
        const allocated_tons = share * Number(total_tons);
        const cost_per_ton = allocated_tons > 0 ? total_cost_sum / allocated_tons : 0;
        const cost_per_meter = cp.total_meters > 0 ? total_cost_sum / cp.total_meters : 0;
        const cost_per_piece = cp.qty > 0 ? total_cost_sum / cp.qty : 0;

        stmtProd.run(
          batchId,
          cp.product_id,
          cp.qty,
          JSON.stringify(cp.extra || []),
          cp.defaultLen,
          cp.total_meters,
          allocated_tons,
          allocated_base_sum,
          allocated_expenses_sum,
          total_cost_sum,
          cost_per_ton,
          cost_per_meter,
          cost_per_piece
        );
      });

      stmtProd.finalize((e) => {
        if (e) return res.status(500).json({ error: 'Xato batch_products yozishda' });

        // Update stock: create a purchase-like record to increase qty (simple approach)
        const stmtPur = db.prepare('INSERT INTO purchases (product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note) VALUES (?, ?, ?, ?, ?, ?)');
        computedProducts.forEach((cp) => {
          // buy_price_per_unit: use cost_per_piece if unit is pcs, else cost_per_meter
          const unitPrice = cp.qty > 0 ? (cp.cost_per_piece || 0) : 0;
          stmtPur.run(cp.product_id, cp.qty, unitPrice, 0, new Date().toISOString(), `Batch ${batchId}`);
        });
        stmtPur.finalize();

        res.json({ id: batchId });
      });
    }
  );
});

// List batches
router.get('/', verifyToken, (req, res) => {
  db.all('SELECT * FROM incoming_batches ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server xatosi' });
    res.json(rows || []);
  });
});

// Get batch details
router.get('/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM incoming_batches WHERE id = ?', [id], (err, batch) => {
    if (err || !batch) return res.status(404).json({ error: 'Batch topilmadi' });

    db.all('SELECT * FROM batch_expenses WHERE batch_id = ?', [id], (err2, expenses) => {
      if (err2) expenses = [];
      db.all('SELECT bp.*, p.name as product_name FROM batch_products bp LEFT JOIN products p ON p.id = bp.product_id WHERE bp.batch_id = ?', [id], (err3, products) => {
        if (err3) products = [];

        // If requester is seller, remove profit-related fields
        const hideProfit = req.user?.role !== 'manager';

        const productsFiltered = products.map((pr) => {
          if (hideProfit) {
            delete pr.allocated_base_sum;
            delete pr.allocated_expenses_sum;
            delete pr.total_cost_sum;
            delete pr.cost_per_ton;
            delete pr.cost_per_meter;
            delete pr.cost_per_piece;
          }
          return pr;
        });

        const response = { batch, expenses: expenses || [], products: productsFiltered };
        res.json(response);
      });
    });
  });
});

export default router;
