// routes/robotData.js
import { Router } from 'express';
const router = Router();
import { readFile, writeFile } from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/log.json');

router.post('/data', (req, res) => {
  const log = req.body;
  console.log("Données reçues du robot :", log);

  readFile(dataPath, (err, data) => {
    let logs = [];
    if (!err && data.length > 0) {
      logs = JSON.parse(data);
    }
    logs.push(log);
    writeFile(dataPath, JSON.stringify(logs, null, 2), err => {
      if (err) return res.status(500).send('Erreur enregistrement');
      res.status(200).send('Données enregistrées');
    });
  });
});

export default router;