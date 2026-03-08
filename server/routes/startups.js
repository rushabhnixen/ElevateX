import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getStartups, getStartup, createStartup, updateStartup, deleteStartup, likeStartup } from '../controllers/startupController.js';

const readLimiter = rateLimit({ windowMs: 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const router = Router();
router.get('/', readLimiter, getStartups);
router.get('/:id', readLimiter, getStartup);
router.post('/', writeLimiter, createStartup);
router.put('/:id', writeLimiter, updateStartup);
router.delete('/:id', writeLimiter, deleteStartup);
router.post('/:id/like', writeLimiter, likeStartup);
export default router;
