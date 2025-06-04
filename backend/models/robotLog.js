// models/robotLog.js
import mongoose from 'mongoose';

const robotLogSchema = new mongoose.Schema({
  // eventTimestamp: Gardons "timestamp" si c'est ce que le robot envoie.
  // C'est l'heure de l'événement côté robot.
  // Mongoose ajoute 'createdAt' qui est l'heure d'insertion en BDD.
  timestamp: {
    type: Number, // Unix timestamp (secondes ou millisecondes) envoyé par le robot
    required: true,
    index: true, // Bon pour les requêtes de tri par date
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'DETECTION',        // Une détection a eu lieu
      'SORT_ATTEMPT',     // Tentative de tri
      'STATUS_UPDATE',    // Mise à jour périodique de l'état
      'MANUAL_COMMAND',   // Commande manuelle exécutée
      'SYSTEM_ERROR',     // Erreur système non liée à un tri spécifique
      'MODE_CHANGE',      // Changement de mode (auto/manuel)
    ],
    default: 'DETECTION',
  },
  // Champs liés à la détection et au tri
  detectedObject: {
    type: String,
    // required: true, // Peut ne pas être requis pour tous les eventType (ex: STATUS_UPDATE)
  },
  confidence: {
    type: Number, // Entre 0 et 1
    min: 0,
    max: 1,
  },
  sortSuccessful: { // Pour les eventType 'SORT_ATTEMPT'
    type: Boolean,
  },
  targetBin: { // Vers quel bac le tri a été tenté/effectué
    type: String, // ex: "plastic_bin", "paper_bin"
  },
  // Champs liés à l'état du robot au moment du log
  batteryLevel: { // Renommé de 'battery' pour plus de clarté
    type: Number, // Pourcentage
    min: 0,
    max: 100,
  },
  motorStatus: {
    type: String, // ex: "idle", "moving_forward", "gripping", "releasing"
  },
  cameraStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ERROR', 'INITIALIZING'],
    default: 'INACTIVE',
  },
  robotMode: {
    type: String,
    enum: ['AUTONOMOUS', 'MANUAL', 'MAINTENANCE'],
  },
  gripperStatus: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'HOLDING', 'ERROR'],
  },
  // Champs pour les erreurs
  errorMessage: {
    type: String, // Message d'erreur s'il y en a eu un
  },
  errorCode: {
    type: String, // Code d'erreur spécifique
  },
  // (Optionnel) Données brutes ou supplémentaires
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Pour toute donnée additionnelle non structurée
  },
}, {
  timestamps: true, // Ajoute createdAt et updatedAt (Date Mongoose)
});

// Index pour améliorer les performances des requêtes courantes
robotLogSchema.index({ eventType: 1, timestamp: -1 });
robotLogSchema.index({ detectedObject: 1, sortSuccessful: 1 });

const RobotLog = mongoose.model('RobotLog', robotLogSchema);

export default RobotLog;