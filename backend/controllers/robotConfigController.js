// controllers/robotConfigController.js
import RobotConfiguration from '../models/RobotConfiguration.js'; // Ajustez le chemin

const DEFAULT_ROBOT_ID = 'tribotik_main';

/**
 * @desc    Récupère la configuration du robot
 * @route   GET /api/robot/config (exemple de route)
 * @access  Private (Dashboard authentifié)
 */
export const getRobotConfiguration = async (req, res) => {
  try {
    const robotId = req.query.robotId || DEFAULT_ROBOT_ID;
    let config = await RobotConfiguration.findOne({ robotId: robotId });

    if (!config) {
      // Si aucune configuration n'existe, en créer une avec les valeurs par défaut
      console.log(`No configuration found for robot ${robotId}. Creating default.`);
      config = new RobotConfiguration({ robotId: robotId }); // Utilise les valeurs par défaut du schéma
      await config.save();
    }
    res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching robot configuration:', error);
    res.status(500).json({ message: 'Server error while fetching configuration', error: error.message });
  }
};

/**
 * @desc    Met à jour la configuration du robot
 * @route   PUT /api/robot/config (exemple de route)
 * @access  Private (Dashboard authentifié)
 */
export const updateRobotConfiguration = async (req, res) => {
  try {
    const robotId = req.body.robotId || DEFAULT_ROBOT_ID;
    const updateData = req.body;
    delete updateData.robotId; // Ne pas essayer de mettre à jour robotId lui-même ici

    const config = await RobotConfiguration.findOneAndUpdate(
      { robotId: robotId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    console.log(`Robot configuration for ${robotId} updated:`, config);
    // TODO: Potentiellement, notifier le robot physique qu'une nouvelle configuration est disponible.
    // Cela dépend de comment le robot récupère sa configuration (pull ou push).

    res.status(200).json(config);
  } catch (error) {
    console.error('Error updating robot configuration:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while updating configuration', error: error.message });
  }
};