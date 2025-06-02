import { Router } from 'express';
import {
  updateRobotState,
  getRobotState,
  sendManualCommand
} from '../controllers/robotStateController.js';

const router = Router();

// @route   PUT /api/robot/state
// @desc    Met à jour ou crée l'état actuel du robot
// @access  Private (robot ou service backend)
router.put('/state', updateRobotState);

// @route   GET /api/robot/state
// @desc    Récupère l'état actuel du robot
// @access  Public/Private
router.get('/state', getRobotState);

// @route   POST /api/robot/command
// @desc    Envoie une commande manuelle au robot
// @access  Private (Dashboard authentifié)
router.post('/command', sendManualCommand);

export default router;