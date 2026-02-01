import express from 'express'
import { prisma } from '../server.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Create batch
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id
    const { supplierName, note, totalTons, pricePerTon, products, expenses } = req.body

    if (!totalTons || !pricePerTon) {
      return res.status(400).json({ error: 'totalTons va pricePerTon kerak' })
    }
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Kamida 1 mahsulot kerak' })
    }

    const baseTotalSum = Number(totalTons) * Number(pricePerTon)

    // Create batch with products and expenses
    const batch = await prisma.incomingBatch.create({
      data: {
        createdById: userId || null,
        supplierName: supplierName || null,
        note: note || null,
        totalTons,
        pricePerTon,
        baseTotalSum,
        batchExpenses: {
          create: Array.isArray(expenses)
            ? expenses.map((e) => ({
                amount: e.amount || 0,
                comment: e.comment || null,
              }))
            : [],
        },
      },
      include: { batchExpenses: true },
    })

    const batchId = batch.id
    const expensesTotal = (batch.batchExpenses || []).reduce((s, e) => s + (e.amount || 0), 0)

    // Compute total meters
    let totalMetersAll = 0
    const computedProducts = products.map((p) => {
      const qty = Number(p.qtyPcs || 0)
      const defaultLen = Number(p.defaultPieceLengthM || 0)
      const extra = Array.isArray(p.pieceLengthsList) ? p.pieceLengthsList.map(Number) : []
      const extraSum = extra.reduce((s, v) => s + (v || 0), 0)
      const totalMeters = qty * defaultLen + extraSum
      totalMetersAll += totalMeters
      return { ...p, qty, defaultLen, extra, totalMeters }
    })

    // Create batch products with cost allocation
    const batchProductsData = computedProducts.map((cp) => {
      const share = totalMetersAll > 0 ? cp.totalMeters / totalMetersAll : 0
      const allocatedBaseSum = share * baseTotalSum
      const allocatedExpensesSum = share * expensesTotal
      const totalCostSum = allocatedBaseSum + allocatedExpensesSum
      const allocatedTons = share * Number(totalTons)
      const costPerTon = allocatedTons > 0 ? totalCostSum / allocatedTons : 0
      const costPerMeter = cp.totalMeters > 0 ? totalCostSum / cp.totalMeters : 0
      const costPerPiece = cp.qty > 0 ? totalCostSum / cp.qty : 0

      return {
        productId: cp.productId,
        qtyPcs: cp.qty,
        pieceLengthsJson: cp.extra || [],
        defaultPieceLengthM: cp.defaultLen,
        totalMeters: cp.totalMeters,
        allocatedTons,
        allocatedBaseSum,
        allocatedExpensesSum,
        totalCostSum,
        costPerTon,
        costPerMeter,
        costPerPiece,
      }
    })

    const batchProductsCreated = await prisma.batchProduct.createMany({
      data: batchProductsData.map((bp) => ({ batchId, ...bp })),
    })

    // Create purchases to update stock
    const purchasesData = computedProducts.map((cp) => ({
      productId: cp.productId,
      qtyIn: cp.qty,
      buyPricePerUnit: cp.qty > 0 ? (cp.costPerPiece || 0) : 0,
      expenseTotal: 0,
      arrivedAt: new Date(),
      note: `Batch ${batchId}`,
    }))

    await prisma.purchase.createMany({
      data: purchasesData,
    })

    res.json({ id: batchId })
  } catch (error) {
    console.error('Batch creation error:', error)
    res.status(500).json({ error: 'Xato batch yaratishda' })
  }
})

// List batches
router.get('/', verifyToken, async (req, res) => {
  try {
    const batches = await prisma.incomingBatch.findMany({
      include: { batchExpenses: true, creator: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(batches)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get batch details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const batchId = parseInt(req.params.id)

    const batch = await prisma.incomingBatch.findUnique({
      where: { id: batchId },
      include: {
        batchExpenses: true,
        batchProducts: { include: { product: true } },
        creator: true,
      },
    })

    if (!batch) {
      return res.status(404).json({ error: 'Batch topilmadi' })
    }

    const hideProfit = req.user?.role !== 'manager'

    const productsFiltered = batch.batchProducts.map((p) => {
      if (hideProfit) {
        const { allocatedBaseSum, allocatedExpensesSum, totalCostSum, costPerTon, costPerMeter, costPerPiece, ...rest } = p
        return rest
      }
      return p
    })

    const response = {
      batch,
      expenses: batch.batchExpenses,
      products: productsFiltered,
    }

    res.json(response)
  } catch (error) {
    res.status(404).json({ error: 'Batch topilmadi' })
  }
})

export default router

