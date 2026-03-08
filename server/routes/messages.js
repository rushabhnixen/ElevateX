import { Router } from 'express';
const router = Router();
router.get('/:roomId', (req, res) => res.json([]));
router.post('/', (req, res) => res.status(201).json(req.body));
export default router;
