import express from 'express'
import { prisma } from '../server.js'
import { verifyToken, verifyManager } from '../middleware/auth.js'

const router = express.Router()

// Get pricing rules
router.get('/:productId', verifyToken, async (req, res) => {
  try {
    const pricing = await prisma.pricingRule.findUnique({
      where: { productId: parseInt(req.params.productId) },
    })
    res.json(pricing || { productId: parseInt(req.params.productId), minimalPricePerUnit: 0, recommendedPricePerUnit: 0 })
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Update pricing rules (manager only)
router.put('/:productId', verifyToken, verifyManager, async (req, res) => {
  try {
    const { minimalPricePerUnit, recommendedPricePerUnit } = req.body

    const productId = parseInt(req.params.productId)

    const pricing = await prisma.pricingRule.upsert({
      where: { productId },
      update: {
        minimalPricePerUnit: minimalPricePerUnit || 0,
        recommendedPricePerUnit: recommendedPricePerUnit || 0,
      },
      create: {
        productId,
        minimalPricePerUnit: minimalPricePerUnit || 0,
        recommendedPricePerUnit: recommendedPricePerUnit || 0,
      },
    })

    res.json({ success: true, pricing })
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

export default router

