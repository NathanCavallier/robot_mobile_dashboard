// hooks/useWastePrediction.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  initiateWastePrediction,
  getWastePredictionResult,
} from '../services/robotService'; // Vérifiez le chemin
import { WastePrediction, TaskStatusResponse, InitiatePredictionResponse } from '../types/robot'; // Vérifiez le chemin
import axios from 'axios';

const POLLING_INTERVAL = 4000; // Interroger toutes les 2 secondes
const MAX_POLLS = 40; // Maximum 30 tentatives (1 minute avec intervalle de 2s)

export const useWastePrediction = () => {
  const [prediction, setPrediction] = useState<WastePrediction | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatusResponse | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollCountRef = useRef<number>(0);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollCountRef.current = 0;
  }, []);

  const pollForResults = useCallback((currentTaskId: string) => {
    clearPolling();

    pollIntervalRef.current = setInterval(async () => {
      if (pollCountRef.current >= MAX_POLLS) {
        setError('Prediction timed out. Please try again.');
        setIsLoading(false);
        clearPolling();
        setTaskStatus(prev => ({ ...prev, state: 'TIMEOUT', status: 'Polling timed out' } as TaskStatusResponse));
        return;
      }

      pollCountRef.current += 1;
      console.log(`Polling attempt: ${pollCountRef.current} for task ${currentTaskId}`);

      try {
        const statusResponse = await getWastePredictionResult(currentTaskId);
        setTaskStatus(statusResponse);
        console.log('Poll response:', statusResponse);

        if (statusResponse.state === 'SUCCESS') {
          setPrediction(statusResponse.result || null);
          setIsLoading(false);
          clearPolling();
        } else if (statusResponse.state === 'FAILURE') {
          setError(statusResponse.error || String(statusResponse.status) || 'Prediction failed.');
          setIsLoading(false);
          clearPolling();
        }
        // Si PENDING ou autre état non final, on continue le polling
      } catch (err: any) {
        console.error('Polling error:', err);
        setError(err.message || 'Failed to get prediction status.');
        setIsLoading(false);
        clearPolling();
      }
    }, POLLING_INTERVAL);
  }, [clearPolling]);


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
        setIsUploading(false);
        setTaskStatus({ state: 'PENDING', status: `Task ${initResponse.task_id} initiated, awaiting processing...` });
        pollForResults(initResponse.task_id);
        return initResponse;
      } catch (err: any) {
        console.error('Error initiating prediction:', err);
        let errorMessage = 'Failed to initiate prediction task.';
        if (axios.isAxiosError(err) && err.response) {
          errorMessage = err.response.data?.error || err.response.data?.message || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setIsUploading(false);
        setIsLoading(false);
        throw err; // Propager pour que le composant puisse aussi réagir si besoin
      }
    },
    [pollForResults, clearPolling] // clearPolling ajouté aux dépendances
  );

  useEffect(() => {
    return () => {
      clearPolling(); // Nettoyage au démontage
    };
  }, [clearPolling]); // clearPolling ajouté aux dépendances

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