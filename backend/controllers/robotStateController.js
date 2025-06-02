// controllers/robotStateController.js
import RobotState from '../models/RobotState.js'; // Ajustez le chemin si nécessaire

const DEFAULT_ROBOT_ID = 'tribotik_main'; // ID par défaut pour votre robot

/**
 * @desc    Met à jour ou crée l'état actuel du robot
 * @route   PUT /api/robot/state  (exemple de route)
 * @access  Private (le robot ou un service backend est la source)
 */
export const updateRobotState = async (req, res) => {
  try {
    const robotId = req.body.robotId || DEFAULT_ROBOT_ID;
    const updateData = { ...req.body, lastSeen: Date.now() };

    // Les champs comme currentErrors pourraient nécessiter une logique de mise à jour plus complexe
    // (par exemple, ajouter à un tableau au lieu de remplacer)
    // Pour l'instant, on fait un remplacement simple des champs fournis.

    const robotState = await RobotState.findOneAndUpdate(
      { robotId: robotId },
      { $set: updateData }, // Utilise $set pour ne mettre à jour que les champs fournis
      { new: true, upsert: true, runValidators: true } // new: retourne le doc mis à jour, upsert: crée si n'existe pas
    );

    console.log('Robot state updated/created:', robotState);
    // Vous pourriez émettre un événement WebSocket ici pour notifier les clients connectés
    // req.io.emit('robot_state_update', robotState); // Si vous avez io attaché à req

    res.status(200).json(robotState);
  } catch (error) {
    console.error('Error updating robot state:', error);
    res.status(500).json({ message: 'Server error while updating robot state', error: error.message });
  }
};

/**
 * @desc    Récupère l'état actuel du robot
 * @route   GET /api/robot/state (exemple de route)
 * @access  Public/Private
 */
export const getRobotState = async (req, res) => {
  try {
    const robotId = req.query.robotId || DEFAULT_ROBOT_ID;
    const robotState = await RobotState.findOne({ robotId: robotId });

    if (!robotState) {
      // Optionnel: créer un état par défaut si aucun n'existe
      // return res.status(404).json({ message: 'Robot state not found. Initialize it first.' });
      const initialDefaultState = new RobotState({ robotId });
      await initialDefaultState.save();
      return res.status(200).json(initialDefaultState);
    }

    res.status(200).json(robotState);
  } catch (error) {
    console.error('Error fetching robot state:', error);
    res.status(500).json({ message: 'Server error while fetching robot state', error: error.message });
  }
};

/**
 * @desc    Envoie une commande manuelle au robot (cette fonction est un placeholder)
 *          La logique réelle d'envoi de commande dépendra de votre communication avec le robot
 *          (ex: MQTT, WebSockets vers le robot, API sur le robot).
 *          Ici, on logue la commande et on met à jour l'état du robot si pertinent.
 * @route   POST /api/robot/command (exemple de route)
 * @access  Private (Dashboard authentifié)
 */
export const sendManualCommand = async (req, res) => {
  const { command, value, robotId = DEFAULT_ROBOT_ID } = req.body;

  if (!command) {
    return res.status(400).json({ message: 'Command is required.' });
  }

  try {
    console.log(`Received command for robot ${robotId}: ${command} - Value: ${value}`);

    // TODO: Implémenter la logique réelle pour envoyer la commande au robot.
    // Par exemple, via un client MQTT, un appel API au robot, etc.
    // const commandSentSuccessfully = await sendCommandToPhysicalRobot(robotId, command, value);
    // if (!commandSentSuccessfully) {
    //   return res.status(500).json({ message: 'Failed to send command to robot' });
    // }

    // Optionnel: Loguer la commande manuelle
    const logEntry = new RobotLog({
      timestamp: Math.floor(Date.now() / 1000), // Unix timestamp en secondes
      eventType: 'MANUAL_COMMAND',
      metadata: { command, value },
      robotMode: 'MANUAL', // Supposant que les commandes manuelles impliquent le mode manuel
      // Potentiellement, récupérer l'état actuel du robot pour les autres champs du log
    });
    await logEntry.save();

    // Optionnel: Mettre à jour l'état du robot si la commande change un état connu
    // (par exemple, si la commande est "TOGGLE_GRIPPER")
    // await RobotState.findOneAndUpdate({ robotId }, { $set: { gripperStatus: newGripperStatus } });

    res.status(200).json({ message: `Command '${command}' received for robot ${robotId}. Actual execution pending.` });
  } catch (error) {
    console.error('Error processing manual command:', error);
    res.status(500).json({ message: 'Server error processing command', error: error.message });
  }
};