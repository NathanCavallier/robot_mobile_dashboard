// src/components/features/robot-status/AiRecognitionPanel.tsx
"use client";

import React from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { BrainCircuit, ShieldCheck, AlertTriangle } from 'lucide-react'; // Icônes exemples

const AiRecognitionPanel = () => {
  const { robotState, isLoadingState } = useRobot();

  if (isLoadingState && !robotState) {
    return (
      <div className="p-4 border rounded-md shadow-sm animate-pulse dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  const lastDetected = robotState?.lastDetectedObject;
  const confidence = robotState?.lastDetectionConfidence;

  return (
    <div className="p-4 border rounded-md shadow-sm dark:border-gray-700 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-200">
        <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
        Reconnaissance IA
      </h3>
      {lastDetected ? (
        <>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Dernier objet détecté : <span className="font-bold capitalize">{lastDetected}</span>
          </p>
          {confidence !== undefined && confidence !== null && (
             <div className="mt-1 flex items-center text-sm text-gray-700 dark:text-gray-300">
              Confiance du modèle :
              <span className={`font-bold ml-1 px-2 py-0.5 rounded-full text-xs
                ${confidence > 0.8 ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' :
                  confidence > 0.5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' :
                  'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Aucun objet détecté récemment.</p>
      )}
      {robotState?.cameraStatus === 'ERROR' && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" /> Erreur caméra détectée.
        </p>
      )}
    </div>
  );
};

export default AiRecognitionPanel;