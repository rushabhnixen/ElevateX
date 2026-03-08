import { Router } from 'express';
import { getStartups, getStartup, createStartup, updateStartup, deleteStartup, likeStartup } from '../controllers/startupController.js';

const router = Router();
router.get('/', getStartups);
router.get('/:id', getStartup);
router.post('/', createStartup);
router.put('/:id', updateStartup);
router.delete('/:id', deleteStartup);
router.post('/:id/like', likeStartup);
export default router;
