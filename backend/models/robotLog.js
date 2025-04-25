const mongoose = require('mongoose');

const robotLogSchema = new mongoose.Schema({
  timestamp: {
    type: Number,
    required: true
  },
  detectedObject: {
    type: String,
    required: true
  },
  motorStatus: {
    type: String,
    required: true
  },
  battery: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const RobotLog = mongoose.model('RobotLog', robotLogSchema);

// Exporter le modèle
export default RobotLog;