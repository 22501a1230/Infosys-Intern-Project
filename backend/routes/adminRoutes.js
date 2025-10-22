import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getStats,
  getAllProjects,
  getAllDatasets
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/projects', protect, admin, getAllProjects);
router.get('/datasets', protect, admin, getAllDatasets);

export default router;
