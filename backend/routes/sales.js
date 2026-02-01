import express from 'express'
import { prisma } from '../server.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Get product cost from purchases
async function getProductCost(productId) {
  const purchases = await prisma.purchase.aggregate({
    where: { productId },
    _sum: { qtyIn: true, expenseTotal: true },
  })

  const totalQty = purchases._sum.qtyIn || 0
  const totalExpense = purchases._sum.expenseTotal || 0

  if (totalQty === 0) return 0
  return totalExpense / totalQty
}

// Create sale
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, customerName, paymentType } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Mahsulot tanlang' })
    }

    // Validate items and calculate totals
    let totalSum = 0
    let totalProfit = 0
    const saleItemsData = []

    for (const item of items) {
      if (item.qty <= 0 || item.sellPricePerUnit <= 0) {
        return res.status(400).json({ error: 'Miqdor va narx to\'g\'ri emas' })
      }

      // Get pricing rule
      const pricing = await prisma.pricingRule.findUnique({
        where: { productId: item.productId },
      })

      const costPrice = await getProductCost(item.productId)
      const minimalPrice = pricing?.minimalPricePerUnit || costPrice

      if (item.sellPricePerUnit < minimalPrice) {
        return res.status(400).json({
          error: `Mahsulot uchun eng past narx: ${minimalPrice} so'm`,
        })
      }

      // Check stock
      const purchases = await prisma.purchase.aggregate({
        where: { productId: item.productId },
        _sum: { qtyIn: true },
      })

      const saleItems = await prisma.saleItem.aggregate({
        where: { productId: item.productId },
        _sum: { qty: true },
      })

      const totalPurchased = purchases._sum.qtyIn || 0
      const totalSold = saleItems._sum.qty || 0
      const currentStock = totalPurchased - totalSold

      if (item.qty > currentStock) {
        return res.status(400).json({
          error: `Yetarli mahsulot mavjud emas. Qoldiq: ${currentStock}`,
        })
      }

      // Calculate line totals
      const lineTotal = item.qty * item.sellPricePerUnit
      const lineProfit = item.qty * (item.sellPricePerUnit - costPrice)

      totalSum += lineTotal
      totalProfit += lineProfit

      saleItemsData.push({
        productId: item.productId,
        qty: item.qty,
        sellPricePerUnit: item.sellPricePerUnit,
        costPricePerUnitSnapshot: costPrice,
        lineTotal,
        lineProfit,
      })
    }

    // Create sale with items
    const sale = await prisma.sale.create({
      data: {
        sellerId: req.user.id,
        soldAt: new Date(),
        customerName: customerName || null,
        paymentType: paymentType || null,
        totalSum,
        totalProfit,
        saleItems: {
          create: saleItemsData,
        },
      },
      include: { saleItems: { include: { product: true } } },
    })

    // If seller, hide profit numbers
    const hideProfit = req.user?.role !== 'manager'
    const resp = {
      id: sale.id,
      totalSum: sale.totalSum,
      customerName: sale.customerName,
      paymentType: sale.paymentType,
      soldAt: sale.soldAt,
      items: sale.saleItems.map((si) => ({
        productId: si.productId,
        qty: si.qty,
        sellPricePerUnit: si.sellPricePerUnit,
        lineTotal: si.lineTotal,
        ...(hideProfit ? {} : { costPricePerUnitSnapshot: si.costPricePerUnitSnapshot, lineProfit: si.lineProfit }),
      })),
    }

    if (!hideProfit) {
      resp.totalProfit = sale.totalProfit
    }

    res.json(resp)
  } catch (error) {
    console.error('Sale creation error:', error)
    res.status(500).json({ error: 'Xato' })
  }
})

// Get sales
router.get('/', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, sellerId } = req.query

    const where = {}
    if (startDate) {
      where.soldAt = { gte: new Date(startDate) }
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      if (where.soldAt) {
        where.soldAt.lte = end
      } else {
        where.soldAt = { lte: end }
      }
    }
    if (sellerId) {
      where.sellerId = parseInt(sellerId)
    }

    const sales = await prisma.sale.findMany({
      where,
      include: { seller: true },
      orderBy: { soldAt: 'desc' },
    })

    // Hide profit for sellers
    const hideProfit = req.user?.role !== 'manager'
    if (hideProfit) {
      const filtered = sales.map((s) => {
        const { totalProfit, ...rest } = s
        return rest
      })
      return res.json(filtered)
    }

    res.json(sales)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get sale details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        saleItems: { include: { product: true } },
        seller: true,
      },
    })

    if (!sale) {
      return res.status(404).json({ error: 'Sotuvni topilmadi' })
    }

    const hideProfit = req.user?.role !== 'manager'
    const itemsFiltered = sale.saleItems.map((item) => {
      const { lineProfit, costPricePerUnitSnapshot, ...rest } = item
      if (hideProfit) {
        return rest
      }
      return item
    })

    const saleResp = { ...sale, saleItems: itemsFiltered }
    if (hideProfit) {
      delete saleResp.totalProfit
    }

    res.json(saleResp)
  } catch (error) {
    res.status(404).json({ error: 'Sotuvni topilmadi' })
  }
})

export default router

