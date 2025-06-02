// middleware/errorMiddleware.js

// Gère les routes non trouvées (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passe l'erreur au prochain middleware (errorHandler)
};

// Gestionnaire d'erreurs global
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Parfois, une erreur peut arriver avec un statusCode de 200, on le change en 500 par défaut
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error("ERROR STACK:", err.stack); // Log complet de l'erreur pour le débogage serveur

  res.json({
    message: err.message,
    // En mode développement, on peut vouloir plus de détails, comme la stack trace
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };