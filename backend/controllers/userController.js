// controllers/userController.js (ou authController.js)
import User from '../models/User.js';
import dotenv from 'dotenv';
import { generateToken } from '../middlewares/authMiddleware.js'; // Importer generateToken

dotenv.config(); // Pour accéder aux variables d'environnement

/**
 * @desc    Crée un utilisateur admin par défaut si aucun admin n'existe.
 *          Cette fonction est destinée à être appelée au démarrage du serveur.
 */
export const createDefaultAdmin = async () => {
  try {
    // Vérifier si un utilisateur avec le rôle 'admin' existe déjà
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Récupérer les identifiants de l'admin par défaut depuis les variables d'environnement
    const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    // Créer le nouvel utilisateur admin
    const defaultAdmin = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword, // Le middleware pre-save s'occupera du hachage
      role: 'admin',
      isVerified: true, // L'admin par défaut est considéré comme vérifié
    });

    await defaultAdmin.save();
    console.log(`Default admin user "${adminUsername}" created successfully.`);

  } catch (error) {
    console.error('Error creating default admin user:', error);
    // Ne pas faire planter le serveur si la création de l'admin échoue,
    // mais loguer l'erreur est important.
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body; // Déjà validé par express-validator si utilisé

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role); // Générer le token

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token, // Envoyer le token au client
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body; // Données validées

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    const user = await User.create({
      username,
      email,
      password, // Le hachage se fait via le middleware pre-save du modèle User
      role: role || 'user', // Rôle par défaut si non fourni (ou valider le rôle)
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Récupère le profil de l'utilisateur connecté
 * @route   GET /api/auth/profile
 * @access  Private (nécessite un token JWT)
 */
export const getUserProfile = async (req, res) => {
  try {
    // L'utilisateur est déjà attaché à req.user par le middleware d'authentification
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
}

/**
 * @desc    Met à jour le profil de l'utilisateur connecté
 * @route   PUT /api/auth/profile
 * @access  Private (nécessite un token JWT)
 */
export const updateUserProfile = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // L'utilisateur est déjà attaché à req.user par le middleware d'authentification
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mettre à jour les champs de l'utilisateur
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Le middleware pre-save s'occupera du hachage

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
}

/**
 * @desc    Supprime le compte de l'utilisateur connecté
 * @route   DELETE /api/auth/profile
 * @access  Private (nécessite un token JWT)
 */
export const deleteUserProfile = async (req, res) => {
  try {
    // L'utilisateur est déjà attaché à req.user par le middleware d'authentification
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
}
// Vous pouvez ajouter d'autres fonctions pour la gestion des rôles, la vérification par email, etc.

