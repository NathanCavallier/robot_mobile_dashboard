import { Router } from 'express';
import {
  createRobotLog,
  getRobotLogs,
  saveToMongo,
  saveToFile,
  saveToCSV,
  saveToText
} from '../controllers/robotLogController.js';

const router = Router();

// @route   POST /api/logs
// @desc    Crée un nouveau log robot
// @access  Private (robot → dashboard)
router.post('/', createRobotLog);

// @route   GET /api/logs
// @desc    Récupère les logs du robot (pagination & filtres)
// @access  Private (dashboard authentifié)
router.get('/', getRobotLogs);

// @route   POST /api/logs/save/mongo
// @desc    Enregistre les données brutes en MongoDB
// @access  Private
router.post('/save/mongo', saveToMongo);

// @route   POST /api/logs/save/file
// @desc    Sauvegarde les logs dans un fichier JSON local
// @access  Private
router.post('/save/file', saveToFile);

// @route   POST /api/logs/save/csv
// @desc    Sauvegarde les logs dans un fichier CSV local
// @access  Private
router.post('/save/csv', saveToCSV);

// @route   POST /api/logs/save/text
// @desc    Sauvegarde les logs dans un fichier texte local
// @access  Private
router.post('/save/text', saveToText);

export default router;