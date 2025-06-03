// contexts/RobotContext.tsx
"use client"; // Ce composant utilise des hooks et du state, il doit être un Client Component

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { RobotState, RobotLog, RobotConfiguration, CommandPayload } from '../types/robot';
import {
  getRobotCurrentState,
  getRobotConfig,
  sendRobotCommand,
  updateRobotConfig as apiUpdateRobotConfig,
  getRobotLogs as apiGetRobotLogs,
  PaginatedRobotLogs
} from '../services/robotService';
import { connectWebSocket, subscribeToEvent, disconnectWebSocket } from '../services/websocketService';

interface RobotContextType {
  robotState: RobotState | null;
  robotConfig: RobotConfiguration | null;
  isLoadingState: boolean;
  isLoadingConfig: boolean;
  errorState: string | null;
  errorConfig: string | null;
  sendCommand: (command: CommandPayload) => Promise<void>;
  fetchRobotState: () => Promise<void>;
  fetchRobotConfig: () => Promise<void>;
  updateRobotConfig: (configData: Partial<RobotConfiguration>) => Promise<void>;
  // Pour l'historique des logs, si géré ici
  logs: RobotLog[];
  paginatedLogsInfo: Omit<PaginatedRobotLogs, 'logs'> | null;
  isLoadingLogs: boolean;
  errorLogs: string | null;
  fetchLogs: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<void>;
  addLogManually: (log: RobotLog) => void; // Pour ajouter un log reçu via WS
}

export const RobotContext = createContext<RobotContextType | undefined>(undefined);

interface RobotProviderProps {
  children: ReactNode;
}

export const RobotProvider: React.FC<RobotProviderProps> = ({ children }) => {
  const [robotState, setRobotState] = useState<RobotState | null>(null);
  const [robotConfig, setRobotConfig] = useState<RobotConfiguration | null>(null);
  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  // State pour les logs
  const [logs, setLogs] = useState<RobotLog[]>([]);
  const [paginatedLogsInfo, setPaginatedLogsInfo] = useState<Omit<PaginatedRobotLogs, 'logs'> | null>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);


  const fetchRobotStateCallback = useCallback(async () => {
    setIsLoadingState(true);
    setErrorState(null);
    try {
      const state = await getRobotCurrentState();
      setRobotState(state);
    } catch (err: any) {
      console.error('Failed to fetch robot state:', err);
      setErrorState(err.message || 'Failed to load robot state');
    } finally {
      setIsLoadingState(false);
    }
  }, []);

  const fetchRobotConfigCallback = useCallback(async () => {
    setIsLoadingConfig(true);
    setErrorConfig(null);
    try {
      const config = await getRobotConfig();
      setRobotConfig(config);
    } catch (err: any) {
      console.error('Failed to fetch robot config:', err);
      setErrorConfig(err.message || 'Failed to load robot configuration');
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  const sendCommandCallback = useCallback(async (command: CommandPayload) => {
    try {
      await sendRobotCommand(command);
      // Optionnel: Mettre à jour l'état local ou refetcher l'état après une commande
      // await fetchRobotStateCallback();
      console.log('Command sent:', command);
    } catch (err: any) {
      console.error('Failed to send command:', err);
      // Gérer l'erreur, peut-être la stocker dans un état d'erreur de commande
      throw err; // Propager l'erreur pour que le composant appelant puisse la gérer
    }
  }, []);

  const updateRobotConfigCallback = useCallback(async (configData: Partial<RobotConfiguration>) => {
    setIsLoadingConfig(true);
    try {
      const updatedConfig = await apiUpdateRobotConfig(configData);
      setRobotConfig(updatedConfig);
    } catch (err: any) {
      console.error('Failed to update robot config:', err);
      setErrorConfig(err.message || 'Failed to update configuration');
      throw err;
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  const fetchLogsCallback = useCallback(async (page: number = 1, limit: number = 10, filters: Record<string, any> = {}) => {
    setIsLoadingLogs(true);
    setErrorLogs(null);
    try {
      const data = await apiGetRobotLogs(page, limit, filters);
      setLogs(data.logs);
      setPaginatedLogsInfo({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalLogs: data.totalLogs,
      });
    } catch (err: any)
    {
      console.error('Failed to fetch logs:', err);
      setErrorLogs(err.message || 'Failed to load logs');
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  const addLogManuallyCallback = useCallback((log: RobotLog) => {
    setLogs(prevLogs => [log, ...prevLogs].slice(0, 50)); // Garder les X derniers logs pour la performance
    // Idéalement, si la pagination est active, on pourrait juste incrémenter totalLogs
    // et notifier qu'une nouvelle page est disponible, ou re-fetcher la page actuelle.
  }, []);


  useEffect(() => {
    fetchRobotStateCallback();
    fetchRobotConfigCallback();
    // Optionnel: fetch les logs initiaux
    // fetchLogsCallback();

    connectWebSocket(); // Connecter au WebSocket au montage du provider

    const unsubscribeStateUpdate = subscribeToEvent('robot_state_update', (newState) => {
      console.log('WebSocket: Received robot_state_update', newState);
      setRobotState(newState);
    });

    const unsubscribeNewLog = subscribeToEvent('new_robot_log', (newLog) => {
      console.log('WebSocket: Received new_robot_log', newLog);
      addLogManuallyCallback(newLog); // Ajoute le log à la liste
      // Ou, si vous voulez toujours être à jour avec la BDD:
      // fetchLogsCallback(paginatedLogsInfo?.currentPage || 1);
    });

    return () => {
      // Nettoyage des abonnements et déconnexion du socket
      unsubscribeStateUpdate?.();
      unsubscribeNewLog?.();
      disconnectWebSocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dépendances vides pour s'exécuter une seule fois au montage

  return (
    <RobotContext.Provider
      value={{
        robotState,
        robotConfig,
        isLoadingState,
        isLoadingConfig,
        errorState,
        errorConfig,
        sendCommand: sendCommandCallback,
        fetchRobotState: fetchRobotStateCallback,
        fetchRobotConfig: fetchRobotConfigCallback,
        updateRobotConfig: updateRobotConfigCallback,
        logs,
        paginatedLogsInfo,
        isLoadingLogs,
        errorLogs,
        fetchLogs: fetchLogsCallback,
        addLogManually: addLogManuallyCallback,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};