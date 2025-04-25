const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/robotDashboard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion MongoDB réussie');
  } catch (err) {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB
