import { Router } from 'express';
const router = Router();
router.get('/:id', (req, res) => res.json({ id: req.params.id }));
router.put('/:id', (req, res) => res.json({ success: true }));
export default router;
