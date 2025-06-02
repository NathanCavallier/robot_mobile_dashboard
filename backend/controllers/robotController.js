import RobotLog from "../models/RobotLog.js"; // Assurez-vous que le chemin est correct
import fs from 'fs';
import path from 'path';

// Pour MongoDB
const saveToMongo = async (req, res) => {
  const log = new RobotLog(req.body);
  try {
    await log.save();
    res.status(200).send('Données enregistrées dans MongoDB');
  } catch (err) {
    res.status(500).send('Erreur enregistrement MongoDB');
  }
};

// Pour fichier JSON local
const saveToFile = async (req, res) => {
  const log = req.body;
  const dataPath = path.join(__dirname, '../data/log.json');
  fs.readFile(dataPath, (err, data) => {
    let logs = [];
    if (!err && data.length > 0) {
      logs = JSON.parse(data);
    }
    logs.push(log);
    fs.writeFile(dataPath, JSON.stringify(logs, null, 2), err => {
      if (err) return res.status(500).send('Erreur écriture fichier');
      res.status(200).send('Données enregistrées localement');
    });
  });
};


// Pour fichier CSV local
const saveToCSV = async (req, res) => {
  const log = req.body;
  const csvPath = path.join(__dirname, '../data/log.csv');
  const csvData = `${log.timestamp},${log.detectedObject},${log.motorStatus},${log.battery}\n`;
  fs.appendFile(csvPath, csvData, err => {
    if (err) return res.status(500).send('Erreur écriture fichier CSV');
    res.status(200).send('Données enregistrées localement dans le fichier CSV');
  });
};

// Pour fichier texte local
const saveToText = async (req, res) => {
  const log = req.body;
  const textPath = path.join(__dirname, '../data/log.txt');
  const textData = `Timestamp: ${log.timestamp}, Detected Object: ${log.detectedObject}, Motor Status: ${log.motorStatus}, Battery: ${log.battery}\n`;
  fs.appendFile(textPath, textData, err => {
    if (err) return res.status(500).send('Erreur écriture fichier texte');
    res.status(200).send('Données enregistrées localement dans le fichier texte');
  });
};


export { saveToMongo, saveToFile, saveToCSV, saveToText };
