// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Pour hacher les mots de passe

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [ // Regex simple pour la validation de l'email
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Ne pas renvoyer le mot de passe par défaut lors des requêtes
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: { // Optionnel: si vous voulez une vérification par email
    type: Boolean,
    default: false,
  },
  // D'autres champs si nécessaire: firstName, lastName, avatar, etc.
}, {
  timestamps: true, // Ajoute createdAt et updatedAt
});

// Middleware Mongoose pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  // Ne hacher le mot de passe que s'il a été modifié (ou est nouveau)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer le mot de passe entré avec celui haché en BDD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;