// hooks/useRobotState.ts
import { useContext } from 'react';
import { RobotContext } from '../contexts/RobotContext'; // Ajustez le chemin

export const useRobot = () => {
  const context = useContext(RobotContext);
  if (context === undefined) {
    throw new Error('useRobot must be used within a RobotProvider');
  }
  return context;
};