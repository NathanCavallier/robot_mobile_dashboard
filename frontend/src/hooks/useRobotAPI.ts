// hooks/useRobotAPI.ts
import { useState, useCallback } from 'react';
// import { predictWasteFromImage } from '../services/robotService'; // Exemple
// import { WastePrediction } from '../types/robot';

// Exemple d'utilisation pour une action API spécifique non gérée par RobotContext
export const useWastePrediction = () => {
  const [prediction, setPrediction] = useState<any | null>(null); // Remplacez 'any' par WastePrediction
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // const result = await predictWasteFromImage(formData); // Décommentez et utilisez le vrai type
      // setPrediction(result);
      // return result;
      console.log("Form Data to predict:", formData.get('image')); // Pour le débogage
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPrediction = { className: "plastique", confidence: 0.92 };
      setPrediction(mockPrediction);
      return mockPrediction;

    } catch (err: any) {
      setError(err.message || 'Failed to get prediction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { prediction, isLoading, error, getPrediction };
};

// Si vous voulez un hook plus générique pour faire des appels avec Axios:
// import apiClient from '../services/apiClient';
// export const useApiCall = <TData = any, TError = Error, TVariables = any>() => {
//   const [data, setData] = useState<TData | null>(null);
//   const [error, setError] = useState<TError | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const execute = useCallback(async (method: 'get' | 'post' | 'put' | 'delete', url: string, payload?: TVariables) => {
//     setIsLoading(true);
//     setError(null);
//     setData(null);
//     try {
//       const response = await apiClient[method]<TData>(url, payload);
//       setData(response.data);
//       return response.data;
//     } catch (e) {
//       setError(e as TError);
//       throw e;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { data, error, isLoading, execute };
// };