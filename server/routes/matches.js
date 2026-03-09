import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createMatch, getMatches, updateMatch } from '../controllers/matchController.js';
import { requireAuth } from '../middleware/auth.js';

const limiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

const router = Router();

router.use(requireAuth);
router.get('/', limiter, getMatches);
router.post('/', limiter, createMatch);
router.put('/:id', limiter, updateMatch);

export default router;
