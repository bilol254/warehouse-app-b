export function initializeDatabase(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('manager', 'seller')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT,
      name TEXT NOT NULL,
      category TEXT,
      unit TEXT NOT NULL DEFAULT 'pcs',
      type TEXT DEFAULT 'product',
      diameter_mm INTEGER,
      brand TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `);

  // Add new columns to existing products table if they do not exist (safe to run)
  try {
    db.run(`ALTER TABLE products ADD COLUMN type TEXT DEFAULT 'product'`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE products ADD COLUMN diameter_mm INTEGER`);
  } catch (e) {}
  try {
    db.run(`ALTER TABLE products ADD COLUMN brand TEXT`);
  } catch (e) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      qty_in INTEGER NOT NULL,
      buy_price_per_unit REAL NOT NULL,
      expense_total REAL NOT NULL DEFAULT 0,
      arrived_at DATETIME NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pricing_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL UNIQUE,
      minimal_price_per_unit REAL NOT NULL,
      recommended_price_per_unit REAL,
      promo_type TEXT,
      promo_value REAL,
      promo_start DATETIME,
      promo_end DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      sold_at DATETIME NOT NULL,
      customer_name TEXT,
      payment_type TEXT,
      total_sum REAL NOT NULL,
      total_profit REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(seller_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      sell_price_per_unit REAL NOT NULL,
      cost_price_per_unit_snapshot REAL NOT NULL,
      line_total REAL NOT NULL,
      line_profit REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sale_id) REFERENCES sales(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Incoming batches table for armature/rebar
  db.run(`
    CREATE TABLE IF NOT EXISTS incoming_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by_user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      supplier_name TEXT,
      note TEXT,
      total_tons REAL NOT NULL,
      price_per_ton REAL NOT NULL,
      base_total_sum REAL NOT NULL,
      FOREIGN KEY(created_by_user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS batch_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty_pcs INTEGER NOT NULL,
      piece_lengths_json TEXT,
      default_piece_length_m REAL,
      total_meters REAL NOT NULL,
      allocated_tons REAL,
      allocated_base_sum REAL,
      allocated_expenses_sum REAL,
      total_cost_sum REAL,
      cost_per_ton REAL,
      cost_per_meter REAL,
      cost_per_piece REAL,
      FOREIGN KEY(batch_id) REFERENCES incoming_batches(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS batch_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(batch_id) REFERENCES incoming_batches(id)
    )
  `);

  // Cash out table
  db.run(`
    CREATE TABLE IF NOT EXISTS cash_out (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by_user_id INTEGER,
      receiver_name TEXT NOT NULL,
      amount REAL NOT NULL,
      taken_at DATETIME NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by_user_id) REFERENCES users(id)
    )
  `);

  // Debts (Nasiya)
  db.run(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by_user_id INTEGER,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      given_at DATETIME NOT NULL,
      due_date DATE NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      status TEXT DEFAULT 'open',
      paid_at DATETIME,
      paid_amount REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by_user_id) REFERENCES users(id)
    )
  `);

  console.log('Database schema initialized');
}
