// routes/robotRoutes.js
import express from 'express';
import { saveToMongo, saveToFile, saveToCSV, saveToText } from '../controllers/robotLogController.js'; // Assurez-vous que le contrôleur est correct
import fs from 'fs/promises'; // Utilisez la version promise
import path from 'path'; // 'path' est déjà importé
import { fileURLToPath } from 'url';

// Recréer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Ou simplement dirname(__filename) si vous avez importé { dirname }

const dataPath = path.join(__dirname, '../data/log.json'); // Maintenant __dirname est défini

const router = express.Router();

// Route pour enregistrer les logs dans MongoDB
router.post('/save/mongo', saveToMongo);

// Route pour enregistrer les logs dans un fichier JSON local
router.post('/save/file', saveToFile); // Cette fonction est maintenant dans robotLogController.js

// Route pour enregistrer les logs dans un fichier CSV local
router.post('/save/csv', saveToCSV); // Cette fonction est maintenant dans robotLogController.js

// Route pour enregistrer les logs dans un fichier texte local
router.post('/save/text', saveToText); // Cette fonction est maintenant dans robotLogController.js

// Route pour récupérer les logs du robot (cette route est redondante avec celle de robotData.js et les nouvelles dans robotLogController.js)
// Vous devriez probablement la supprimer ou la refactoriser si elle a un but unique.
router.post('/data', async (req, res) => { // Utilisez async/await
  const log = req.body;
  console.log("Données reçues du robot (via robotRoutes.js):", log);

  try {
    let logs = [];
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      if (data.length > 0) {
        logs = JSON.parse(data);
      }
    } catch (readError) {
      if (readError.code !== 'ENOENT') {
        console.error('Error reading log file (via robotRoutes.js):', readError);
      }
    }

    logs.push(log);

    try {
      await fs.writeFile(dataPath, JSON.stringify(logs, null, 2));
      res.status(200).send('Données enregistrées (via robotRoutes.js)');
    } catch (writeError) {
      console.error('Error writing log file (via robotRoutes.js):', writeError);
      res.status(500).send('Erreur enregistrement (via robotRoutes.js)');
    }
  } catch (error) {
    console.error('Unexpected error in /data route (via robotRoutes.js):', error);
    res.status(500).send('Erreur serveur inattendue (via robotRoutes.js)');
  }
});

export default router;