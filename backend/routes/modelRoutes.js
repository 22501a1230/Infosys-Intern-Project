import express from 'express';
import {
  trainModel,
  getModels,
  getModel,
  deleteModel
} from '../controllers/modelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/train', protect, trainModel);
router.get('/project/:projectId', protect, getModels);
router.route('/:id')
  .get(protect, getModel)
  .delete(protect, deleteModel);

export default router;
