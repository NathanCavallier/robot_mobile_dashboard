// src/components/features/manual-controls/ModeToggle.tsx
"use client";

import React from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { Button } from '@/components/ui/Button';
import { Bot, UserCog } from 'lucide-react';

const ModeToggle = () => {
  const { sendCommand, robotState, isLoadingState } = useRobot();

  const currentMode = robotState?.currentMode;

  const handleSetMode = (mode: 'AUTONOMOUS' | 'MANUAL') => {
    sendCommand({ command: 'SET_MODE', value: mode });
  };

  if (isLoadingState && !robotState) {
    return <div className="p-2 text-sm text-gray-500">Chargement du mode...</div>;
  }

  return (
    <div className="p-4 border rounded-md shadow-sm dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Mode de Fonctionnement</h3>
      <div className="flex gap-3">
        <Button
          onClick={() => handleSetMode('AUTONOMOUS')}
          disabled={isLoadingState || currentMode === 'AUTONOMOUS'}
          variant={currentMode === 'AUTONOMOUS' ? 'default' : 'outline'}
          className="flex-1"
        >
          <Bot className="mr-2 h-5 w-5" /> Autonome
        </Button>
        <Button
          onClick={() => handleSetMode('MANUAL')}
          disabled={isLoadingState || currentMode === 'MANUAL'}
          variant={currentMode === 'MANUAL' ? 'default' : 'outline'}
          className="flex-1"
        >
          <UserCog className="mr-2 h-5 w-5" /> Manuel
        </Button>
      </div>
       {currentMode && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Mode actuel : <span className="font-semibold capitalize">{currentMode.toLowerCase()}</span>
        </p>
      )}
    </div>
  );
};

export default ModeToggle;