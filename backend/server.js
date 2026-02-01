import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import purchaseRoutes from './routes/purchases.js'
import saleRoutes from './routes/sales.js'
import reportRoutes from './routes/reports.js'
import userRoutes from './routes/users.js'
import pricingRoutes from './routes/pricing.js'
import batchRoutes from './routes/batches.js'
import cashoutRoutes from './routes/cashout.js'
import debtsRoutes from './routes/debts.js'

const app = express()
const PORT = process.env.PORT || 5000

// Initialize Prisma Client
export const prisma = new PrismaClient()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/users', userRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/cashout', cashoutRoutes)
app.use('/api/debts', debtsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

