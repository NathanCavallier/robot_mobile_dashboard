import { Router } from 'express';
import {
  getRobotConfiguration,
  updateRobotConfiguration
} from '../controllers/robotConfigController.js';

const router = Router();

// @route   GET /api/robot/config
// @desc    Récupère la configuration du robot
// @access  Private (Dashboard authentifié)
router.get('/config', getRobotConfiguration);

// @route   PUT /api/robot/config
// @desc    Met à jour la configuration du robot
// @access  Private (Dashboard authentifié)
router.put('/config', updateRobotConfiguration);

export default router;