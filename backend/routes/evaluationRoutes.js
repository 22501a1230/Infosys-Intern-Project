import express from 'express';
import {
  evaluateModel,
  getEvaluations,
  getEvaluation,
  compareModels,
  exportEvaluation
} from '../controllers/evaluationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/evaluate', protect, evaluateModel);
router.post('/compare', protect, compareModels);
router.get('/model/:modelId', protect, getEvaluations);
router.get('/:id/export', protect, exportEvaluation);
router.get('/:id', protect, getEvaluation);

export default router;
