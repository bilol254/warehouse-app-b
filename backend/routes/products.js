import express from 'express'
import { prisma } from '../server.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// Get all products with current stock
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            purchases: true,
            saleItems: true,
          },
        },
        pricingRule: true,
      },
    })

    const enriched = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      unit: p.unit,
      type: p.type,
      diameterMm: p.diameterMm,
      brand: p.brand,
      isActive: p.isActive,
      createdAt: p.createdAt,
      pricingRule: p.pricingRule,
    }))

    res.json(enriched)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Get single product with stock
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        pricingRule: true,
        purchases: true,
        saleItems: true,
      },
    })

    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' })
    }

    res.json(product)
  } catch (error) {
    res.status(404).json({ error: 'Mahsulot topilmadi' })
  }
})

// Create product (manager only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Faqat menejer mahsulot yaratishi mumkin' })
    }

    const { sku, name, category, unit, type, diameterMm, brand } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Mahsulot nomi kerak' })
    }

    const product = await prisma.product.create({
      data: {
        sku: sku || null,
        name,
        category: category || null,
        unit: unit || 'pcs',
        type: type || null,
        diameterMm: diameterMm || null,
        brand: brand || null,
        isActive: true,
      },
    })

    // Create default pricing rule
    await prisma.pricingRule.create({
      data: {
        productId: product.id,
        minimalPricePerUnit: 0,
        recommendedPricePerUnit: 0,
      },
    })

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// Search products
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const query = req.params.query

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ name: { contains: query, mode: 'insensitive' } }, { sku: { contains: query, mode: 'insensitive' } }],
      },
      include: {
        pricingRule: true,
      },
      take: 20,
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

export default router

