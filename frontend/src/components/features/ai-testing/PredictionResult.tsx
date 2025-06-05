// src/components/features/ai-testing/PredictionResult.tsx
"use client";

import React from 'react';
import { WastePrediction } from '@/types/robot'; // Ajustez le chemin

interface PredictionResultProps {
  prediction: WastePrediction | null;
  error?: string | null;
  isLoading?: boolean;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ prediction, error, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-6 p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Analyse en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
        <h3 className="text-md font-semibold text-red-700 dark:text-red-300">Erreur de Prédiction</h3>
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      </div>
    );
  }

  if (!prediction) {
    return null; // Ou un message indiquant "Aucune prédiction disponible"
  }

  return (
    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
      <h3 className="text-md font-semibold text-green-800 dark:text-green-200">Résultat de la Prédiction :</h3>
      <div className="mt-2 space-y-1 text-sm">
        <p>
          Type de déchet : <span className="font-bold capitalize">{prediction.className}</span>
        </p>
        <p>
          Confiance : <span className="font-bold">
            {typeof prediction.confidence === 'number'
              ? `${(prediction.confidence * 100).toFixed(1)}%`
              : prediction.confidence}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;