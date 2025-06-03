import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'; // Logger HTTP (optionnel mais utile pour le dev)

// Import des routes
import logRoutes from './routes/logRoutes.js';
import configRoutes from './routes/configRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Importer les routes d'authentification
// Importez vos anciennes routes si vous les gardez temporairement ou les fusionnez
import oldRobotDataRoutes from './routes/robotData.js'; // Exemple
import oldRobotRoutes from './routes/robotRoutes.js';   // Exemple

// Import des middlewares personnalisés (si vous en avez)
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'; // À créer

dotenv.config(); // S'assurer que les variables d'environnement sont chargées

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logger HTTP pour le développement
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Autoriser les requêtes de votre frontend Next.js
  credentials: true, // Si vous utilisez des cookies ou des sessions
}));
app.use(express.json()); // Pour parser les requêtes JSON (req.body)
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes URL-encoded

// Montage des routes
app.use('/api/logs', logRoutes);
app.use('/api/robot', configRoutes);
app.use('/api/robot', stateRoutes);
app.use('/api/auth', authRoutes); // Routes d'authentification

// Montage de vos anciennes routes (vous devrez peut-être ajuster les préfixes ou les refactoriser)
// Exemple:
app.use('/api/old', oldRobotDataRoutes);   // Préfixé pour éviter les conflits
app.use('/api/old/robot', oldRobotRoutes); // Préfixé

// Route de test simple
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Tribotik Backend is running!' });
});

// Middlewares de gestion des erreurs (doivent être les derniers middlewares)
app.use(notFound);      // Pour les routes non trouvées (404)
app.use(errorHandler);  // Gestionnaire d'erreurs global

export default app;