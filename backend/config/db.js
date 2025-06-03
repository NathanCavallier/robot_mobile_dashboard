import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI || 'mongodb+srv://nathanimogo:p44LIA76WkgKfQbb@trobotik-db.678dx15.mongodb.net/?retryWrites=true&w=majority&appName=trobotik-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion MongoDB réussie');
  } catch (err) {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
  }
};

export default connectDB
