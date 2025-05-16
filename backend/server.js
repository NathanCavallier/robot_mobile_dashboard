// filepath: /Users/nathanimogo/Documents/GitHub/robot_mobile_dashboard/backend/server.js
import express from 'express';
import bodyParser from 'body-parser'; // Importation corrigée
import robotRoutes from './routes/robotRoutes.js';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
config();

// Connexion à MongoDB
const mongoURI = process.env.MONGO_URI;
connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB', err);
  });

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Utilisation de bodyParser
app.use(bodyParser.json({ limit: '50mb' })); // Limite de taille pour les fichiers
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' })); // Limite de taille pour les fichiers

app.use('/api/robot', robotRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});