// hooks/useWastePrediction.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  initiateWastePrediction,
  getWastePredictionResult,
} from '../services/robotService';
import { WastePrediction, TaskStatusResponse, InitiatePredictionResponse } from '../types/robot';

const POLLING_INTERVAL = 2000; // Interroger toutes les 2 secondes
const MAX_POLLS = 30; // Maximum 30 tentatives (1 minute avec intervalle de 2s)

export const useWastePrediction = () => {
  const [prediction, setPrediction] = useState<WastePrediction | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatusResponse | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Vrai pendant l'upload et le polling
  const [isUploading, setIsUploading] = useState(false); // Spécifiquement pour l'upload initial
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);

  const clearPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollCountRef.current = 0;
  };

  const pollForResults = useCallback((currentTaskId: string) => {
    clearPolling(); // S'assurer qu'il n'y a pas de polling en double

    pollIntervalRef.current = setInterval(async () => {
      if (pollCountRef.current >= MAX_POLLS) {
        setError('Prediction timed out. Please try again.');
        setIsLoading(false);
        clearPolling();
        return;
      }

      pollCountRef.current += 1;

      try {
        const statusResponse = await getWastePredictionResult(currentTaskId);
        setTaskStatus(statusResponse);

        if (statusResponse.state === 'SUCCESS') {
          setPrediction(statusResponse.result || null);
          setIsLoading(false);
          clearPolling();
        } else if (statusResponse.state === 'FAILURE') {
          setError(statusResponse.error || statusResponse.status || 'Prediction failed.');
          setIsLoading(false);
          clearPolling();
        }
        // Si PENDING ou autre, on continue le polling (géré par l'intervalle)
      } catch (err: any) {
        setError(err.message || 'Failed to get prediction status.');
        setIsLoading(false);
        clearPolling();
      }
    }, POLLING_INTERVAL);
  }, []);


  const submitImageForPrediction = useCallback(
    async (formData: FormData) => {
      setIsUploading(true);
      setIsLoading(true);
      setError(null);
      setPrediction(null);
      setTaskStatus(null);
      setTaskId(null);
      clearPolling();

      try {
        const initResponse: InitiatePredictionResponse = await initiateWastePrediction(formData);
        setTaskId(initResponse.task_id);
        setIsUploading(false); // L'upload est terminé, le polling commence
        // Mettre à jour l'état initial de la tâche
        setTaskStatus({ state: 'PENDING', status: 'Task initiated, awaiting processing...' });
        pollForResults(initResponse.task_id); // Commencer le polling
        return initResponse; // Retourner la réponse initiale si le composant en a besoin
      } catch (err: any) {
        setError(err.message || 'Failed to initiate prediction task.');
        setIsUploading(false);
        setIsLoading(false);
        throw err;
      }
    },
    [pollForResults]
  );

  // Nettoyage au démontage du composant utilisant ce hook
  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  return {
    prediction,
    taskStatus,
    taskId,
    isLoading,
    isUploading,
    error,
    submitImageForPrediction,
  };
};