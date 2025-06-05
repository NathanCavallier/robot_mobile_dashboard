// models/RobotConfiguration.js
import mongoose from 'mongoose';

const robotConfigurationSchema = new mongoose.Schema({
  robotId: {
    type: String,
    required: true,
    unique: true,
    default: 'tribotik_main',
  },
  // Paramètres de connexion
  serialPort: {
    type: String,
    trim: true,
  },
  wifiSsid: {
    type: String,
    trim: true,
  },
  // wifiPassword: { type: String }, // Attention à la sécurité si stocké
  bluetoothDeviceName: {
    type: String,
    trim: true,
  },
  // Paramètres IA
  aiModelEndpoint: { // URL du serveur Flask pour l'IA
    type: String,
    trim: true,
  },
  detectionConfidenceThreshold: { // Seuil de confiance pour considérer une détection comme valide
    type: Number,
    min: 0,
    max: 1,
    default: 0.75,
  },
  // Paramètres de fonctionnement
  autonomousModeEnabled: {
    type: Boolean,
    default: true,
  },
  maxMotorSpeed: {
    type: Number,
    default: 100, // Pourcentage ou valeur arbitraire
  },
  logLevel: {
    type: String,
    enum: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
    default: 'INFO',
  },
  // D'autres paramètres...
  customSettings: {
    type: mongoose.Schema.Types.Mixed,
  }
}, {
  timestamps: true,
});

const RobotConfiguration = mongoose.model('RobotConfiguration', robotConfigurationSchema);

export default RobotConfiguration;