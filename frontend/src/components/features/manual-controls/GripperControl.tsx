// src/components/features/manual-controls/GripperControl.tsx
"use client";

import React from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { Button } from '@/components/ui/Button'; // Assurez-vous d'avoir ce composant
import { Hand, HandMetal, CircleDot } from 'lucide-react'; // Icônes exemples

const GripperControl = () => {
  const { sendCommand, robotState, isLoadingState } = useRobot();

  const handleGripperOpen = () => {
    sendCommand({ command: 'GRIPPER_ACTION', value: 'OPEN' });
  };

  const handleGripperClose = () => {
    sendCommand({ command: 'GRIPPER_ACTION', value: 'CLOSE' });
  };

  // Optionnel: une commande pour attraper/relâcher un objet spécifique après détection
  // const handleGripperGrab = () => {
  //   sendCommand({ command: 'GRIPPER_GRAB_DETECTED' });
  // };

  const isDisabled = isLoadingState || robotState?.currentMode !== 'MANUAL';
  const gripperStatus = robotState?.gripperStatus;

  return (
    <div className="p-4 border rounded-md shadow-sm dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Contrôle de la Pince</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleGripperOpen}
          disabled={isDisabled || gripperStatus === 'OPEN'}
          variant="outline"
          className="flex-1"
        >
          <Hand className="mr-2 h-5 w-5" /> Ouvrir
        </Button>
        <Button
          onClick={handleGripperClose}
          disabled={isDisabled || gripperStatus === 'CLOSED' || gripperStatus === 'HOLDING'}
          variant="outline"
          className="flex-1"
        >
          <HandMetal className="mr-2 h-5 w-5" /> Fermer
        </Button>
      </div>
      {gripperStatus && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Statut de la pince : <span className="font-semibold capitalize">{gripperStatus.toLowerCase()}</span>
        </p>
      )}
      {!robotState && isLoadingState && <p className="text-xs text-gray-500 mt-2">Chargement état...</p>}
      {robotState?.currentMode !== 'MANUAL' && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          Les commandes manuelles de la pince sont désactivées hors du mode manuel.
        </p>
      )}
    </div>
  );
};

export default GripperControl;