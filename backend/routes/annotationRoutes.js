import express from 'express';
import {
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getUncertainAnnotations,
  autoSuggest
} from '../controllers/annotationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dataset/:datasetId', protect, getAnnotations);
router.get('/uncertain/:datasetId', protect, getUncertainAnnotations);
router.post('/', protect, createAnnotation);
router.post('/suggest', protect, autoSuggest);
router.route('/:id')
  .put(protect, updateAnnotation)
  .delete(protect, deleteAnnotation);

export default router;
