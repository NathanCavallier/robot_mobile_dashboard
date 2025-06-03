// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Ajustez le chemin si nécessaire
import dotenv from 'dotenv';

dotenv.config();

/**
 * @desc Protège les routes en vérifiant la validité du token JWT.
 *       Si valide, attache les informations de l'utilisateur à req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Lire le token JWT depuis le header 'Authorization' (Bearer token)
  // ou depuis les cookies (si vous choisissez cette approche)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données sans le mot de passe
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Passer au prochain middleware ou au contrôleur de la route
    } catch (error) {
      console.error('Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * @desc Vérifie si l'utilisateur authentifié a le rôle 'admin'.
 *       Doit être utilisé APRÈS le middleware 'protect'.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
  }
};

/**
 * @desc Middleware générique pour autoriser l'accès basé sur les rôles.
 *       Prend un tableau de rôles autorisés en argument.
 *       Doit être utilisé APRÈS le middleware 'protect'.
 * @param  {...string} roles - Liste des rôles autorisés.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'User role not found, access denied' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};


// Helper pour générer le token JWT (peut aussi être dans un fichier utils/jwtUtils.js)
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};