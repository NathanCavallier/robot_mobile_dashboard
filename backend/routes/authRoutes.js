// routes/authRoutes.js (exemple)
import express from 'express';
import { body } from 'express-validator'; // Importer les validateurs
import { loginUser, registerUser } from '../controllers/userController.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js'; // Importer le gestionnaire

const router = express.Router();

router.post(
  '/register',
  [ // Tableau des chaînes de validation
    body('username', 'Username is required').notEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  handleValidationErrors, // Gérer les erreurs de validation
  registerUser // Le contrôleur n'est appelé que si la validation passe
);

router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('password', 'Password is required').exists(),
    ],
    handleValidationErrors,
    loginUser
);

export default router;