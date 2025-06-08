// routes/robotData.js
import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises'; // Utilisez la version promise de fs pour un code plus propre
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();

// Recréer __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, '../data/log.json'); // Maintenant __dirname est défini

router.post('/data', async (req, res) => { // Utilisez async/await avec fs/promises
  const log = req.body;
  console.log("Données reçues du robot :", log);

  try {
    let logs = [];
    try {
      const data = await readFile(dataPath, 'utf-8');
      if (data.length > 0) {
        logs = JSON.parse(data);
      }
    } catch (readError) {
      if (readError.code !== 'ENOENT') { // Si l'erreur n'est pas "fichier non trouvé"
        console.error('Error reading log file:', readError);
        // Ne pas renvoyer de réponse ici, laisser l'écriture tenter ou échouer
      }
      // Si le fichier n'existe pas, logs reste un tableau vide, ce qui est OK.
    }

    logs.push(log);

    try {
      await writeFile(dataPath, JSON.stringify(logs, null, 2));
      res.status(200).send('Données enregistrées');
    } catch (writeError) {
      console.error('Error writing log file:', writeError);
      res.status(500).send('Erreur enregistrement');
    }
  } catch (error) { // Catch global pour des erreurs inattendues
    console.error('Unexpected error in /data route:', error);
    res.status(500).send('Erreur serveur inattendue');
  }
});

export default router;