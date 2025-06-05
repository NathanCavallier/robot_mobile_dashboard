// src/components/features/robot-status/RobotStateDisplay.tsx
"use client";

import React from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { BatteryFull, BatteryMedium, BatteryLow, Wifi, WifiOff, Disc3, Power, Cog, Camera } from 'lucide-react'; // Icônes exemples

interface StatusItemProps {
  icon: React.ReactElement;
  label: string;
  value: string | number | undefined;
  unit?: string;
  statusColor?: string; // Tailwind text color class e.g., 'text-green-500'
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, unit, statusColor }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <div className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        {label} :
    <span className="ml-1 font-medium">{value !== undefined && value !== null ? value : 'N/A'}</span>
    </div>
    {value !== undefined && value !== null ? (
      <span className={`text-sm font-semibold ${statusColor || 'text-gray-900 dark:text-white'}`}>
        {value}{unit}
      </span>
    ) : (
      <span className="text-sm text-gray-400 dark:text-gray-500">N/A</span>
    )}
  </div>
);


const RobotStateDisplay = () => {
  const { robotState, isLoadingState, errorState } = useRobot();

  if (isLoadingState && !robotState) {
    return (
      <div className="p-4 border rounded-md shadow-sm animate-pulse dark:border-gray-700">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 last:mb-0"></div>
        ))}
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="p-4 border rounded-md shadow-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        Erreur de chargement de l'état du robot : {errorState}
      </div>
    );
  }

  if (!robotState) {
    return (
      <div className="p-4 border rounded-md shadow-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
        Aucune donnée d'état du robot disponible.
      </div>
    );
  }

  const battery = robotState.batteryLevel;
  let batteryIcon = <BatteryMedium />;
  let batteryColor = 'text-yellow-500';
  if (battery !== undefined) {
    if (battery > 70) { batteryIcon = <BatteryFull />; batteryColor = 'text-green-500'; }
    else if (battery <= 30) { batteryIcon = <BatteryLow />; batteryColor = 'text-red-500'; }
  }

  const connectionStatus = robotState.connectionStatus;
  let connectionIcon = <WifiOff />;
  let connectionColor = 'text-red-500';
  if (connectionStatus === 'CONNECTED') { connectionIcon = <Wifi />; connectionColor = 'text-green-500'; }
  else if (connectionStatus === 'CONNECTING') { connectionColor = 'text-yellow-500'; }


  return (
    <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">État Général du Robot</h3>
      <div className="space-y-1">
        <StatusItem
          icon={batteryIcon as React.ReactElement}
          label="Niveau Batterie"
          value={battery}
          unit="%"
          statusColor={batteryColor}
        />
        <StatusItem
          icon={<Cog />}
          label="Mode Actuel"
          value={robotState.currentMode?.toLowerCase()}
          statusColor={robotState.currentMode === 'AUTONOMOUS' ? 'text-blue-500' : robotState.currentMode === 'MANUAL' ? 'text-orange-500' : undefined}
        />
        <StatusItem
          icon={<Disc3 />}
          label="État Moteur"
          value={robotState.motorStatus?.toLowerCase()}
        />
        <StatusItem
          icon={<Camera />}
          label="État Caméra"
          value={robotState.cameraStatus?.toLowerCase()}
          statusColor={robotState.cameraStatus === 'ACTIVE' ? 'text-green-500' : robotState.cameraStatus === 'ERROR' ? 'text-red-500' : undefined}
        />
         <StatusItem
          icon={connectionIcon as React.ReactElement}
          label="Connexion Dashboard"
          value={connectionStatus?.toLowerCase()}
          statusColor={connectionColor}
        />
        <StatusItem
          icon={<Power />}
          label="Dernière activité"
          value={robotState.lastSeen ? new Date(robotState.lastSeen).toLocaleString() : undefined}
        />
      </div>
    </div>
  );
};

export default RobotStateDisplay;