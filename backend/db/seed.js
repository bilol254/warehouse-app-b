import bcryptjs from 'bcryptjs';

export function seedDatabase(db) {
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err || row.count > 0) return;

    // Default manager user
    const adminPassword = bcryptjs.hashSync('admin123', 10);
    db.run(
      'INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Bosh menejer', 'admin', adminPassword, 'manager']
    );

    // Sample seller user
    const sellerPassword = bcryptjs.hashSync('seller123', 10);
    db.run(
      'INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Sotuvchi Ali', 'ali', sellerPassword, 'seller']
    );

    // Sample products
    db.run(
      'INSERT INTO products (sku, name, category, unit, is_active) VALUES (?, ?, ?, ?, ?)',
      ['SKU001', 'Samosa', 'Nonushta', 'pcs', 1]
    );
    db.run(
      'INSERT INTO products (sku, name, category, unit, is_active) VALUES (?, ?, ?, ?, ?)',
      ['SKU002', 'Burinaka', 'Ichimlik', 'pcs', 1]
    );
    db.run(
      'INSERT INTO products (sku, name, category, unit, is_active) VALUES (?, ?, ?, ?, ?)',
      ['SKU003', 'Nan', 'Nonushta', 'dona', 1],
      function () {
        // Add pricing rules
        const productId1 = 1;
        const productId2 = 2;
        const productId3 = 3;

        db.run(
          'INSERT INTO pricing_rules (product_id, minimal_price_per_unit, recommended_price_per_unit) VALUES (?, ?, ?)',
          [productId1, 3000, 4000]
        );
        db.run(
          'INSERT INTO pricing_rules (product_id, minimal_price_per_unit, recommended_price_per_unit) VALUES (?, ?, ?)',
          [productId2, 2000, 2500]
        );
        db.run(
          'INSERT INTO pricing_rules (product_id, minimal_price_per_unit, recommended_price_per_unit) VALUES (?, ?, ?)',
          [productId3, 500, 700]
        );

        // Add sample purchases
        db.run(
          'INSERT INTO purchases (product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note) VALUES (?, ?, ?, ?, ?, ?)',
          [productId1, 50, 2000, 10000, new Date().toISOString(), 'Birinchi partiya']
        );
        db.run(
          'INSERT INTO purchases (product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note) VALUES (?, ?, ?, ?, ?, ?)',
          [productId2, 100, 1500, 5000, new Date().toISOString(), 'Ikkinchi partiya']
        );
        db.run(
          'INSERT INTO purchases (product_id, qty_in, buy_price_per_unit, expense_total, arrived_at, note) VALUES (?, ?, ?, ?, ?, ?)',
          [productId3, 200, 300, 2000, new Date().toISOString(), 'Uchinchi partiya'],
          function () {
            // Add sample sales
            const now = new Date().toISOString();
            db.run(
              'INSERT INTO sales (seller_id, sold_at, customer_name, total_sum, total_profit) VALUES (?, ?, ?, ?, ?)',
              [2, now, 'Qodir', 8000, 2000],
              function (err) {
                if (!err) {
                  const saleId = this.lastID;
                  // Add sale items
                  db.run(
                    'INSERT INTO sale_items (sale_id, product_id, qty, sell_price_per_unit, cost_price_per_unit_snapshot, line_total, line_profit) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [saleId, productId1, 2, 4000, 2200, 8000, 3600]
                  );
                }
              }
            );
            db.run(
              'INSERT INTO sales (seller_id, sold_at, customer_name, total_sum, total_profit) VALUES (?, ?, ?, ?, ?)',
              [2, new Date(Date.now() - 86400000).toISOString(), 'Kamol', 5000, 1000],
              function (err) {
                if (!err) {
                  const saleId = this.lastID;
                  db.run(
                    'INSERT INTO sale_items (sale_id, product_id, qty, sell_price_per_unit, cost_price_per_unit_snapshot, line_total, line_profit) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [saleId, productId2, 2, 2500, 1750, 5000, 1500]
                  );
                }
              }
            );
          }
        );
      }
    );

    console.log('Database seeded with sample data');
  });
}
