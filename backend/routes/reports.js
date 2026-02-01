import express from 'express'
import { prisma } from '../server.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Get reports/stats
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrowStart = new Date(today)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    // Today's stats
    const todayStats = await prisma.sale.aggregate({
      where: {
        soldAt: {
          gte: today,
          lt: tomorrowStart,
        },
      },
      _count: { id: true },
      _sum: { totalSum: true, totalProfit: true },
    })

    // Top products today
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          soldAt: {
            gte: today,
            lt: tomorrowStart,
          },
        },
      },
      _sum: { qty: true, lineTotal: true, lineProfit: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: 5,
    })

    // Get product names
    const productIds = topProducts.map((p) => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const productsMap = Object.fromEntries(products.map((p) => [p.id, p]))

    const hideProfit = req.user?.role !== 'manager'

    const statsResp = {
      salesCount: todayStats._count.id,
      totalRevenue: todayStats._sum.totalSum || 0,
      totalProfit: todayStats._sum.totalProfit || 0,
    }

    if (hideProfit) {
      delete statsResp.totalProfit
    }

    const topProductsResp = topProducts.map((p) => ({
      productId: p.productId,
      name: productsMap[p.productId]?.name,
      qtySold: p._sum.qty || 0,
      revenue: p._sum.lineTotal || 0,
      ...(hideProfit ? {} : { profit: p._sum.lineProfit || 0 }),
    }))

    res.json({ todayStats: statsResp, topProducts: topProductsResp })
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get stock summary
router.get('/stock-summary', verifyToken, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        pricingRule: true,
        purchases: true,
        saleItems: true,
      },
    })

    const stockSummary = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentQty: (p.purchases.reduce((sum, pur) => sum + pur.qtyIn, 0) || 0) - (p.saleItems.reduce((sum, si) => sum + si.qty, 0) || 0),
      minimalPricePerUnit: p.pricingRule?.minimalPricePerUnit || 0,
      recommendedPricePerUnit: p.pricingRule?.recommendedPricePerUnit || 0,
    }))

    res.json(stockSummary)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get period report
router.get('/period', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Sanalarni kiriting' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Period stats
    const periodStats = await prisma.sale.aggregate({
      where: {
        soldAt: {
          gte: start,
          lte: end,
        },
      },
      _count: { id: true },
      _sum: { totalSum: true, totalProfit: true },
    })

    // Aggregate sale items
    const saleItems = await prisma.saleItem.findMany({
      where: {
        sale: {
          soldAt: {
            gte: start,
            lte: end,
          },
        },
      },
      include: { product: true, sale: true },
    })

    // Group by product
    const productStats = {}
    saleItems.forEach((si) => {
      if (!productStats[si.productId]) {
        productStats[si.productId] = {
          productId: si.productId,
          name: si.product.name,
          qtySold: 0,
          revenue: 0,
          profit: 0,
        }
      }
      productStats[si.productId].qtySold += si.qty
      productStats[si.productId].revenue += si.lineTotal
      productStats[si.productId].profit += si.lineProfit
    })

    const hideProfit = req.user?.role !== 'manager'

    const statsResp = {
      salesCount: periodStats._count.id,
      totalRevenue: periodStats._sum.totalSum || 0,
      totalProfit: periodStats._sum.totalProfit || 0,
      totalQtySold: saleItems.reduce((sum, si) => sum + si.qty, 0),
    }

    if (hideProfit) {
      delete statsResp.totalProfit
    }

    const productsResp = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .map((p) => {
        if (hideProfit) {
          const { profit, ...rest } = p
          return rest
        }
        return p
      })

    res.json({ stats: statsResp, products: productsResp })
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

export default router

