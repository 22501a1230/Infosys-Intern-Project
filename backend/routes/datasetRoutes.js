import express from 'express';
import {
  uploadDataset,
  getDatasets,
  getDataset,
  deleteDataset
} from '../controllers/datasetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', protect, uploadDataset);
router.get('/project/:projectId', protect, getDatasets);
router.route('/:id')
  .get(protect, getDataset)
  .delete(protect, deleteDataset);

export default router;
