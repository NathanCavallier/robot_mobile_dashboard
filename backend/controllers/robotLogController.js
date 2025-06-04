// controllers/robotLogController.js
import RobotLog from '../models/robotLog.js'; // Ajustez le chemin si nécessaire

/**
 * @desc    Crée un nouveau log robot
 * @route   POST /api/logs  (exemple de route, à définir dans vos fichiers de routes)
 * @access  Private (devrait être protégé, le robot étant la source)
 */
export const createRobotLog = async (req, res) => {
  try {
    // Les données du log sont attendues dans req.body
    // Assurez-vous que le robot envoie les données avec les champs attendus
    // par le schéma RobotLog (timestamp, eventType, etc.)
    const {
      timestamp, // Envoyé par le robot
      eventType,
      detectedObject,
      confidence,
      sortSuccessful,
      targetBin,
      batteryLevel,
      motorStatus,
      cameraStatus,
      robotMode,
      gripperStatus,
      errorMessage,
      errorCode,
      metadata,
    } = req.body;

    if (timestamp === undefined || !eventType) {
      return res.status(400).json({ message: 'Timestamp and eventType are required for logs' });
    }

    const newLog = new RobotLog({
      timestamp,
      eventType,
      detectedObject,
      confidence,
      sortSuccessful,
      targetBin,
      batteryLevel,
      motorStatus,
      cameraStatus,
      robotMode,
      gripperStatus,
      errorMessage,
      errorCode,
      metadata,
    });

    const savedLog = await newLog.save();
    console.log('Robot log saved to MongoDB:', savedLog);
    res.status(201).json(savedLog);
  } catch (error) {
    console.error('Error saving robot log:', error);
    res.status(500).json({ message: 'Server error while saving robot log', error: error.message });
  }
};

/**
 * @desc    Récupère les logs du robot avec pagination et filtres
 * @route   GET /api/logs (exemple de route)
 * @access  Public/Private (selon si vous voulez que le dashboard y accède directement)
 */
export const getRobotLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Nombre de logs par page
    const skip = (page - 1) * limit;

    // Options de filtrage (exemples)
    const filters = {};
    if (req.query.eventType) {
      filters.eventType = req.query.eventType;
    }
    if (req.query.detectedObject) {
      filters.detectedObject = { $regex: req.query.detectedObject, $options: 'i' }; // Recherche insensible à la casse
    }
    if (req.query.sortSuccessful) {
      filters.sortSuccessful = req.query.sortSuccessful === 'true';
    }
    // Vous pouvez ajouter plus de filtres (date range, etc.)

    const logs = await RobotLog.find(filters)
      .sort({ timestamp: -1 }) // Les plus récents en premier
      .skip(skip)
      .limit(limit);

    const totalLogs = await RobotLog.countDocuments(filters);

    res.status(200).json({
      logs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs,
    });
  } catch (error) {
    console.error('Error fetching robot logs:', error);
    res.status(500).json({ message: 'Server error while fetching robot logs', error: error.message });
  }
};

// Vous pouvez garder vos fonctions saveToFile, saveToCSV, saveToText ici
// ou les déplacer si elles ne concernent que les logs bruts reçus
// plutôt que les logs structurés pour MongoDB.
// Pour l'instant, je me concentre sur MongoDB.

// Adaption de votre saveToMongo existant
// Note: Il est préférable que les données entrantes correspondent déjà au schéma
// ou que vous les transformiez ici.
export const saveToMongo = async (req, res) => {
  try {
    const logData = req.body; // Données reçues du robot

    // Validation/Transformation minimale (idéalement, le robot envoie des données conformes)
    if (!logData.timestamp || !logData.detectedObject || !logData.motorStatus || logData.battery === undefined) {
        // Si vous gardez l'ancien format de log pour cette route spécifique
        console.warn("Received log data might not match the full RobotLog schema for saveToMongo.");
    }

    // Mappage vers le nouveau schéma si nécessaire, ou s'assurer que logData est déjà correct
    const newLog = new RobotLog({
        timestamp: logData.timestamp,
        eventType: logData.eventType || 'DETECTION', // Valeur par défaut si non fournie
        detectedObject: logData.detectedObject,
        confidence: logData.confidence,
        sortSuccessful: logData.sortSuccessful,
        targetBin: logData.targetBin,
        batteryLevel: logData.battery, // Mappage de 'battery' vers 'batteryLevel'
        motorStatus: logData.motorStatus,
        cameraStatus: logData.cameraStatus,
        robotMode: logData.robotMode,
        gripperStatus: logData.gripperStatus,
        errorMessage: logData.errorMessage,
        errorCode: logData.errorCode,
    });

    await newLog.save();
    console.log('Data saved to MongoDB via /save/mongo:', newLog);
    res.status(200).send('Data saved to MongoDB');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Error saving data to MongoDB: ' + error.message);
  }
};

// Les autres fonctions saveToFile, saveToCSV, saveToText peuvent rester ici
// ou être adaptées pour utiliser les données de req.body de manière plus générique
// si elles ne dépendent pas spécifiquement de la structure Mongoose.
// Par exemple, pour saveToFile (qui semble enregistrer le log.json brut):
import fs from 'fs/promises'; // Utilisation de la version promise de fs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/log.json'); // Assurez-vous que ce chemin est correct

export const saveToFile = async (req, res) => {
  const logEntry = req.body;
  console.log("Data received for file saving:", logEntry);

  try {
    let logs = [];
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      if (data.length > 0) {
        logs = JSON.parse(data);
      }
    } catch (readError) {
      if (readError.code !== 'ENOENT') { // Si l'erreur n'est pas "fichier non trouvé"
        throw readError; // Propager d'autres erreurs de lecture
      }
      // Si le fichier n'existe pas, logs reste un tableau vide, ce qui est OK.
    }

    logs.push(logEntry);
    await fs.writeFile(dataPath, JSON.stringify(logs, null, 2));
    res.status(200).send('Data saved to file');
  } catch (err) {
    console.error('Error saving data to file:', err);
    res.status(500).send('Error saving data to file');
  }
};

// saveToCSV et saveToText nécessiteraient des logiques similaires pour
// lire le fichier existant (si append) ou écrire, et formater les données.
// Je vais omettre leur implémentation détaillée ici pour rester concis
// car elles ne dépendent pas directement de Mongoose.

// Pour fichier CSV local
export const saveToCSV = async (req, res) => {
  const log = req.body;
  const csvPath = path.join(__dirname, '../data/log.csv');
  const csvData = `${log.timestamp},${log.detectedObject},${log.motorStatus},${log.battery}\n`;
  fs.appendFile(csvPath, csvData, err => {
    if (err) return res.status(500).send('Erreur écriture fichier CSV');
    res.status(200).send('Données enregistrées localement dans le fichier CSV');
  });
};

// Pour fichier texte local
export const saveToText = async (req, res) => {
  const log = req.body;
  const textPath = path.join(__dirname, '../data/log.txt');
  const textData = `Timestamp: ${log.timestamp}, Detected Object: ${log.detectedObject}, Motor Status: ${log.motorStatus}, Battery: ${log.battery}\n`;
  fs.appendFile(textPath, textData, err => {
    if (err) return res.status(500).send('Erreur écriture fichier texte');
    res.status(200).send('Données enregistrées localement dans le fichier texte');
  });
};