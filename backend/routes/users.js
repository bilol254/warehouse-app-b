import express from 'express'
import bcryptjs from 'bcryptjs'
import { prisma } from '../server.js'
import { verifyToken, verifyManager } from '../middleware/auth.js'

const router = express.Router()

// Get all users (manager only)
router.get('/', verifyToken, verifyManager, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, username: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

// Create user (manager only)
router.post('/', verifyToken, verifyManager, async (req, res) => {
  try {
    const { name, username, password, role } = req.body

    if (!name || !username || !password || !role) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' })
    }

    if (!['manager', 'seller'].includes(role)) {
      return res.status(400).json({ error: 'Rol noto\'g\'ri' })
    }

    const passwordHash = await bcryptjs.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, username, passwordHash, role },
      select: { id: true, name: true, username: true, role: true },
    })

    res.json(user)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Foydalanuvchi nomi allaqachon mavjud' })
    }
    res.status(500).json({ error: 'Xato' })
  }
})

// Delete user (manager only)
router.delete('/:id', verifyToken, verifyManager, async (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'O\'zingizni o\'chira olmaysiz' })
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Xato' })
  }
})

export default router
});

export default router;
