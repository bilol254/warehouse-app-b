import express from 'express'
import { prisma } from '../server.js'
import { verifyToken, verifyManager } from '../middleware/auth.js'

const router = express.Router()

// Create cash out
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id
    const { receiverName, amount, takenAt, note } = req.body

    if (!receiverName || !amount || !takenAt) {
      return res.status(400).json({ error: 'receiverName, amount, takenAt kerak' })
    }

    const cashOut = await prisma.cashOut.create({
      data: {
        createdById: userId || null,
        receiverName,
        amount,
        takenAt: new Date(takenAt),
        note: note || null,
      },
    })

    res.json(cashOut)
  } catch (error) {
    res.status(500).json({ error: 'Xato yozishda' })
  }
})

// List cashouts with simple filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { from, to, receiver } = req.query
    const where = {}

    if (from) {
      where.takenAt = { gte: new Date(from) }
    }
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      if (where.takenAt) {
        where.takenAt.lte = end
      } else {
        where.takenAt = { lte: end }
      }
    }
    if (receiver) {
      where.receiverName = { contains: receiver, mode: 'insensitive' }
    }

    const cashouts = await prisma.cashOut.findMany({
      where,
      orderBy: { takenAt: 'desc' },
    })

    res.json(cashouts)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Manager-only delete
router.delete('/:id', verifyToken, verifyManager, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.cashOut.delete({
      where: { id },
    })

    res.json({ deleted: true })
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// Manager-only update
router.put('/:id', verifyToken, verifyManager, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { receiverName, amount, takenAt, note } = req.body

    const updated = await prisma.cashOut.update({
      where: { id },
      data: {
        receiverName,
        amount,
        takenAt: new Date(takenAt),
        note,
      },
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

export default router

