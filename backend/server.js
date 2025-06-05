// server.js
import http from 'http'; // Nécessaire pour Socket.IO
import dotenv from 'dotenv';
 import { Server as SocketIOServer } from 'socket.io'; // Décommentez pour Socket.IO

import app from './app.js'; // Importe l'application Express configurée
import connectDB from './config/db.js'; // Importe la fonction de connexion à la BDD

import { createDefaultAdmin } from './controllers/userController.js'; // Importer la fonction

dotenv.config(); // S'assurer que les variables d'environnement sont chargées

const PORT = process.env.PORT || 5002; // Port par défaut pour le serveur

// Fonction principale pour démarrer le serveur
const startServer = async () => {
  try {
    // 1. Connexion à la base de données MongoDB
    await connectDB();

    // 2. Création du serveur HTTP (nécessaire pour Socket.IO)
    const httpServer = http.createServer(app);

    // 3. (Optionnel) Configuration de Socket.IO
    const io = new SocketIOServer(httpServer, {
       cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
       }
    });

    // 3.1. Création d'un utilisateur admin par défaut si aucun n'existe
    await createDefaultAdmin();

    // // Middleware pour attacher 'io' à l'objet 'req' pour y accéder dans les contrôleurs
    app.use((req, res, next) => {
       req.io = io;
       next();
    });

    io.on('connection', (socket) => {
       console.log('A user connected to WebSocket:', socket.id);

       socket.on('disconnect', () => {
         console.log('User disconnected:', socket.id);
    });

    // Vous pouvez ajouter des listeners pour des événements spécifiques du client ici
       // socket.on('client_event', (data) => { ... });
    });

    // 4. Démarrage du serveur HTTP
    httpServer.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();