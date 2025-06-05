// src/components/features/sort-history/ErrorLogFeed.tsx
"use client";

import React, { useEffect } from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { RobotLog } from '@/types/robot';
import { AlertTriangle, Info } from 'lucide-react';

const ErrorLogFeed = ({ maxEntries = 5 }: { maxEntries?: number }) => {
  const { logs: allLogs, isLoadingLogs, fetchLogs, errorLogs: fetchLogsError } = useRobot();

  useEffect(() => {
    // Fetch logs une fois si pas encore fait, ou si on veut rafraîchir
    // Pour ce composant, on pourrait vouloir des logs spécifiques d'erreur.
    // Mais pour l'instant, on filtre les logs généraux.
    if (!allLogs.length && !isLoadingLogs) {
      fetchLogs(1, 50, { eventType: 'SYSTEM_ERROR' }); // Fetch plus pour avoir une chance d'avoir des erreurs
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // S'exécute une fois

  const errorLogs = allLogs
    .filter(log => log.eventType === 'SYSTEM_ERROR' || log.eventType === 'SORT_ATTEMPT' && log.sortSuccessful === false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Les plus récents d'abord
    .slice(0, maxEntries);

  if (isLoadingLogs && !errorLogs.length) {
    return <div className="p-3 text-sm text-gray-500 dark:text-gray-400">Chargement du journal des erreurs...</div>;
  }

  if (fetchLogsError) {
    return <div className="p-3 text-sm text-red-600 dark:text-red-400">Erreur: {fetchLogsError}</div>;
  }

  if (!errorLogs.length) {
    return (
      <div className="p-3 text-sm text-green-600 dark:text-green-400 flex items-center">
        <Info className="h-5 w-5 mr-2" /> Aucune erreur récente enregistrée.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errorLogs.map((log: RobotLog) => (
        <div key={log._id} className={`p-3 rounded-md border ${log.eventType === 'SYSTEM_ERROR' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'}`}>
          <div className="flex items-center text-sm font-semibold">
            <AlertTriangle className={`h-5 w-5 mr-2 ${log.eventType === 'SYSTEM_ERROR' ? 'text-red-500' : 'text-yellow-500'}`} />
            {log.eventType === 'SYSTEM_ERROR' ? 'Erreur Système' : 'Échec de Tri'}
            <span className="ml-auto text-xs font-normal text-gray-500 dark:text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
          {log.errorMessage && <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">Message : {log.errorMessage}</p>}
          {log.errorCode && <p className="text-xs text-gray-600 dark:text-gray-400">Code : {log.errorCode}</p>}
          {log.detectedObject && log.eventType === 'SORT_ATTEMPT' && (
            <p className="text-xs text-gray-600 dark:text-gray-400">Objet : {log.detectedObject}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ErrorLogFeed;