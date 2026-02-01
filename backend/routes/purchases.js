import express from 'express'
import { prisma } from '../server.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Add purchase (manager and seller)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, qtyIn, buyPricePerUnit, expenseTotal, arrivedAt, note } = req.body

    if (!productId || !qtyIn || buyPricePerUnit === undefined) {
      return res.status(400).json({ error: 'Zarur maydonlarni to\'ldiring' })
    }

    const purchase = await prisma.purchase.create({
      data: {
        productId,
        qtyIn,
        buyPricePerUnit,
        expenseTotal: expenseTotal || 0,
        arrivedAt: arrivedAt ? new Date(arrivedAt) : new Date(),
        note: note || null,
      },
      include: { product: true },
    })

    res.json(purchase)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// Get purchases
router.get('/', verifyToken, async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { product: true },
      orderBy: { arrivedAt: 'desc' },
    })

    res.json(purchases)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get purchases for specific product
router.get('/product/:productId', verifyToken, async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { productId: parseInt(req.params.productId) },
      orderBy: { arrivedAt: 'desc' },
    })

    res.json(purchases)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

export default router

