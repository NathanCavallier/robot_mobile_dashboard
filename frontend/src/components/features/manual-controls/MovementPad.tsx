// src/components/features/manual-controls/MovementPad.tsx
"use client";

import React from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { Button } from '@/components/ui/Button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CircleStop } from 'lucide-react';

type Direction = 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT' | 'STOP';

const MovementPad = () => {
  const { sendCommand, robotState, isLoadingState } = useRobot();

  const handleMove = (direction: Direction) => {
    sendCommand({ command: 'MOVE', value: direction });
  };

  // Optionnel: maintenir la commande pour un mouvement continu
  // const handleMouseDown = (direction: Direction) => { sendCommand({ command: 'MOVE_START', value: direction }); };
  // const handleMouseUp = () => { sendCommand({ command: 'MOVE_STOP' }); };
  // Pour les touches, il faudrait un event listener sur le document.

  const isDisabled = isLoadingState || robotState?.currentMode !== 'MANUAL';

  return (
    <div className="p-4 border rounded-md shadow-sm dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Déplacement Manuel</h3>
      <div className="grid grid-cols-3 gap-2 w-max mx-auto">
        <div></div> {/* Placeholder pour aligner */}
        <Button onClick={() => handleMove('FORWARD')} disabled={isDisabled} aria-label="Avancer">
          <ArrowUp className="h-6 w-6" />
        </Button>
        <div></div> {/* Placeholder */}

        <Button onClick={() => handleMove('LEFT')} disabled={isDisabled} aria-label="Gauche">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button onClick={() => handleMove('STOP')} disabled={isDisabled} variant="destructive" aria-label="Stop">
          <CircleStop className="h-6 w-6" />
        </Button>
        <Button onClick={() => handleMove('RIGHT')} disabled={isDisabled} aria-label="Droite">
          <ArrowRight className="h-6 w-6" />
        </Button>

        <div></div> {/* Placeholder */}
        <Button onClick={() => handleMove('BACKWARD')} disabled={isDisabled} aria-label="Reculer">
          <ArrowDown className="h-6 w-6" />
        </Button>
        <div></div> {/* Placeholder */}
      </div>
       {!robotState && isLoadingState && <p className="text-xs text-center text-gray-500 mt-2">Chargement état...</p>}
      {robotState?.currentMode !== 'MANUAL' && (
        <p className="text-xs text-center text-amber-600 dark:text-amber-400 mt-2">
          Les commandes de déplacement sont désactivées hors du mode manuel.
        </p>
      )}
    </div>
  );
};

export default MovementPad;