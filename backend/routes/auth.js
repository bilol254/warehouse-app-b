import express from 'express'
import bcryptjs from 'bcryptjs'
import { prisma } from '../server.js'
import { generateToken, verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', async (req, res) => {
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
      data: {
        name,
        username,
        passwordHash,
        role,
      },
    })

    const token = generateToken({ id: user.id, username: user.username, role: user.role })
    res.json({ user: { id: user.id, name: user.name, username: user.username, role: user.role }, token })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Foydalanuvchi nomi allaqachon mavjud' })
    }
    res.status(500).json({ error: 'Registratsiya xatosi' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Foydalanuvchi nomi va parol kiritilsin' })
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
    }

    const isValid = await bcryptjs.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Parol noto\'g\'ri' })
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role })
    res.json({
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
      token,
    })
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, username: true, role: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' })
  }
})

export default router

