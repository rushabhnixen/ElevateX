import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { getStartups, getStartup, createStartup, updateStartup, deleteStartup, likeStartup, bookmarkStartup, getComments, createComment } from '../controllers/startupController.js';
import { requireAuth } from '../middleware/auth.js';

const readLimiter = rateLimit({ windowMs: 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pitch_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files are allowed'));
  },
});

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'elevatex-dev-secret-change-in-production');
      req.userId = decoded.userId;
    } catch {}
  }
  next();
}

const router = Router();
router.get('/', readLimiter, optionalAuth, getStartups);
router.get('/:id', readLimiter, optionalAuth, getStartup);
router.post('/', writeLimiter, requireAuth, upload.single('video'), createStartup);
router.put('/:id', writeLimiter, requireAuth, updateStartup);
router.delete('/:id', writeLimiter, requireAuth, deleteStartup);
router.post('/:id/like', writeLimiter, requireAuth, likeStartup);
router.post('/:id/bookmark', writeLimiter, requireAuth, bookmarkStartup);
router.get('/:id/comments', readLimiter, getComments);
router.post('/:id/comments', writeLimiter, requireAuth, createComment);
export default router;

