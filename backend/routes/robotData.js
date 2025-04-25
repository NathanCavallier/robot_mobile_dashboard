const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/log.json');

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

module.exports = router;