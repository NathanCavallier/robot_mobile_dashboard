// routes/robotRoutes.js
import express from 'express';
import { saveToMongo, saveToFile, saveToCSV, saveToText } from '../controllers/robotController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/log.json');

const router = express.Router();

// Route pour enregistrer les logs dans MongoDB
router.post('/save/mongo', saveToMongo);

// Route pour enregistrer les logs dans un fichier JSON local
router.post('/save/file', saveToFile);

// Route pour enregistrer les logs dans un fichier CSV local
router.post('/save/csv', saveToCSV);

// Route pour enregistrer les logs dans un fichier texte local
router.post('/save/text', saveToText);

// Route pour récupérer les logs du robot
router.post('/data', (req, res) => {
  const log = req.body;
  console.log("Données reçues du robot :", log);

  fs.readFile(dataPath, (err, data) => {
    let logs = [];
    if (!err && data.length > 0) {
      logs = JSON.parse(data);
    }
    logs.push(log);
    fs.writeFile(dataPath, JSON.stringify(logs, null, 2), err => {
      if (err) return res.status(500).send('Erreur enregistrement');
      res.status(200).send('Données enregistrées');
    });
  });
});

export default router;