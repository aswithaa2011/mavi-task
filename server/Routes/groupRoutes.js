import { Router } from 'express';
import { getGroups, createGroup, deleteGroup } from '../controllers/groupController.js';

const router = Router();

router.get('/',    getGroups);
router.post('/',   createGroup);
router.delete('/:id', deleteGroup);

export default router;
