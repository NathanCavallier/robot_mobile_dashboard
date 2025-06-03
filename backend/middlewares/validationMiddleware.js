// middleware/validationMiddleware.js
import { validationResult } from 'express-validator';

/**
 * @desc Middleware pour gérer les résultats de validation d'express-validator.
 *       Doit être placé après les chaînes de validation dans les routes.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};