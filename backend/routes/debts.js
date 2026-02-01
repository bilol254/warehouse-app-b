import express from 'express'
import { prisma } from '../server.js'
import { verifyToken, verifyManager } from '../middleware/auth.js'

const router = express.Router()

// Create debt
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id
    const { customerName, phone, givenAt, dueDate, amount, note } = req.body

    if (!customerName || !phone || !givenAt || !dueDate || !amount) {
      return res.status(400).json({ error: 'Kerakli maydonlar yetishmayapti' })
    }
    if (String(phone).length < 9) {
      return res.status(400).json({ error: 'Phone format kamida 9 belgi' })
    }

    const debt = await prisma.debt.create({
      data: {
        createdById: userId || null,
        customerName,
        phone,
        givenAt: new Date(givenAt),
        dueDate: new Date(dueDate),
        amount,
        note: note || null,
        status: 'open',
      },
    })

    res.json(debt)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// List debts with filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, from, to, dueFrom, dueTo, search } = req.query
    const where = {}

    if (status) {
      where.status = status
    }
    if (from) {
      where.givenAt = { gte: new Date(from) }
    }
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      if (where.givenAt) {
        where.givenAt.lte = end
      } else {
        where.givenAt = { lte: end }
      }
    }
    if (dueFrom) {
      where.dueDate = { gte: new Date(dueFrom) }
    }
    if (dueTo) {
      const end = new Date(dueTo)
      end.setHours(23, 59, 59, 999)
      if (where.dueDate) {
        where.dueDate.lte = end
      } else {
        where.dueDate = { lte: end }
      }
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const debts = await prisma.debt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(debts)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Pay debt
router.post('/:id/pay', verifyToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { paidAmount } = req.body

    if (!paidAmount) {
      return res.status(400).json({ error: 'paidAmount kerak' })
    }

    const debt = await prisma.debt.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
        paidAmount,
      },
    })

    res.json(debt)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// Edit (manager only)
router.put('/:id', verifyToken, verifyManager, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { customerName, phone, givenAt, dueDate, amount, note, status } = req.body

    const debt = await prisma.debt.update({
      where: { id },
      data: {
        customerName,
        phone,
        givenAt: new Date(givenAt),
        dueDate: new Date(dueDate),
        amount,
        note,
        status: status || 'open',
      },
    })

    res.json(debt)
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

// Delete (manager only)
router.delete('/:id', verifyToken, verifyManager, async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.debt.delete({
      where: { id },
    })

    res.json({ deleted: true })
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

export default router

