import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './db/init.js';
import { seedDatabase } from './db/seed.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import purchaseRoutes from './routes/purchases.js';
import saleRoutes from './routes/sales.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import pricingRoutes from './routes/pricing.js';
import batchRoutes from './routes/batches.js';
import cashoutRoutes from './routes/cashout.js';
import debtsRoutes from './routes/debts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
export const db = new sqlite3.Database(path.join(__dirname, 'warehouse.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('SQLite database connected');
  }
});

// Initialize database on startup
db.serialize(() => {
  initializeDatabase(db);
  seedDatabase(db);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/cashout', cashoutRoutes);
app.use('/api/debts', debtsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
