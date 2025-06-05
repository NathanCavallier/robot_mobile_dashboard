// src/components/features/system-config/SystemLogViewer.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { RobotLog } from '@/types/robot';
import { ScrollText, Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const LOG_TYPES_TO_DISPLAY: RobotLog['eventType'][] = [
  'SYSTEM_ERROR',
  'STATUS_UPDATE', // Peut être verbeux
  'MODE_CHANGE',
  // 'DETECTION', // Peut être trop verbeux ici
  // 'SORT_ATTEMPT'
];

const SystemLogViewer = ({ initialMaxEntries = 100 }: { initialMaxEntries?: number }) => {
  const { logs: allLogs, isLoadingLogs, fetchLogs, errorLogs: fetchLogsError, addLogManually } = useRobot();
  const [filter, setFilter] = useState<string>(''); // Pour filtrer par message
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial logs
    if (!allLogs.length && !isLoadingLogs) {
      fetchLogs(1, initialMaxEntries); // Fetch un bon nombre de logs pour commencer
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [allLogs]);


  const systemLogs = allLogs
    .filter(log =>
        (LOG_TYPES_TO_DISPLAY.includes(log.eventType)) &&
        (filter ? JSON.stringify(log).toLowerCase().includes(filter.toLowerCase()) : true)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // Plus anciens en premier pour affichage type console


  // Fonction pour simuler l'ajout d'un log (pour le test, à retirer)
  const handleAddTestLog = () => {
    addLogManually({
      _id: `test_${Date.now()}`,
      timestamp: Date.now(),
      eventType: 'STATUS_UPDATE',
      message: 'Test log entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      batteryLevel: Math.floor(Math.random() * 100),
      motorStatus: 'IDLE',
    } as RobotLog);
  };


  return (
    <div className="p-4 border rounded-md shadow-sm bg-gray-900 text-gray-200 font-mono dark:border-gray-700 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center">
          <Terminal className="mr-2 h-5 w-5" /> Journal Système
        </h3>
        {/* <Button onClick={handleAddTestLog} size="sm" variant="ghost">Add Test Log</Button> */}
        <input
            type="text"
            placeholder="Filtrer les logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-1 pr-2 text-xs">
        {isLoadingLogs && systemLogs.length === 0 && <p>Chargement des logs...</p>}
        {fetchLogsError && <p className="text-red-400">Erreur: {fetchLogsError}</p>}
        {!isLoadingLogs && systemLogs.length === 0 && !fetchLogsError && <p>Aucun log système à afficher.</p>}

        {systemLogs.map((log) => (
          <div key={log._id} className="flex items-start">
            <span className="text-gray-500 mr-2 min-w-[150px] shrink-0">
              [{new Date(log.createdAt).toLocaleTimeString()}]
            </span>
            <Badge
              variant={
                log.eventType === 'SYSTEM_ERROR' ? 'destructive' :
                log.eventType === 'MODE_CHANGE' ? 'secondary' : // Adaptez les variants
                'outline'
              }
              className="mr-2 text-xs h-5 px-1.5 py-0 shrink-0"
            >
              {log.eventType.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className={`whitespace-pre-wrap break-all ${log.eventType === 'SYSTEM_ERROR' ? 'text-red-400' : ''}`}>
              {log.errorMessage || log.detectedObject || JSON.stringify(log.metadata) || 'Log entry'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLogViewer;