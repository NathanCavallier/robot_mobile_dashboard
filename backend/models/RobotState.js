// models/RobotState.js
import mongoose from 'mongoose';


const robotStateSchema = new mongoose.Schema({
  robotId: { // Au cas où vous auriez plusieurs robots un jour
    type: String,
    required: true,
    unique: true, // Assure un seul état par robotId
    default: 'tribotik_main', // ID par défaut pour le premier robot
  },
  lastSeen: { // Dernière fois que l'état a été mis à jour
    type: Date,
    default: Date.now,
    index: true,
  },
  // État actuel
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
  },
  motorStatus: {
    type: String,
    default: 'IDLE',
  },
  cameraStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ERROR', 'INITIALIZING'],
    default: 'INACTIVE',
  },
  currentMode: {
    type: String,
    enum: ['AUTONOMOUS', 'MANUAL', 'MAINTENANCE', 'OFFLINE'],
    default: 'OFFLINE',
  },
  gripperStatus: {
    type: String,
    enum: ['OPEN', 'CLOSED', 'HOLDING', 'ERROR'],
    default: 'OPEN',
  },
  // Dernière détection
  lastDetectedObject: {
    type: String,
  },
  lastDetectionConfidence: {
    type: Number,
    min: 0,
    max: 1,
  },
  // Informations de connexion/système
  connectionStatus: { // Statut de la connexion avec le dashboard/serveur
    type: String,
    enum: ['CONNECTED', 'DISCONNECTED', 'CONNECTING'],
    default: 'DISCONNECTED',
  },
  currentErrors: [{ // Liste des erreurs actives ou récentes
    message: String,
    code: String,
    timestamp: Date,
  }],
  // Optionnel: position, vitesse, etc. si pertinent
  // currentPosition: { x: Number, y: Number, orientation: Number },
}, {
  timestamps: true, // createdAt, updatedAt
});

const RobotState = mongoose.model('RobotState', robotStateSchema);

export default RobotState;