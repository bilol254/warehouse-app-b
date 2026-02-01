import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key-change-in-production';

export function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token yaroqsiz' });
  }
}

export function verifyManager(req, res, next) {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Faqat menejer kirishi mumkin' });
  }
  next();
}

export function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, {
    expiresIn: '7d'
  });
}

export const SECRET = SECRET_KEY;
