// src/components/features/ai-testing/AiLabComponent.tsx
"use client";

import React, { useState } from 'react';
import { useWastePrediction } from '@/hooks/useWastePrediction'; // Ajustez le chemin
import ImageUploader from './ImageUploader';
import PredictionResult from './PredictionResult';
import { Button } from '@/components/ui/Button'; // Assurez-vous d'avoir ce composant
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'; // Assurez-vous d'avoir ce composant

const AiLabComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    prediction,
    taskStatus,
    // taskId, // Moins utile à afficher directement, sauf pour le debug
    isLoading, // Regroupe isUploading et polling
    error,
    submitImageForPrediction,
  } = useWastePrediction();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Réinitialiser l'état si un nouveau fichier est sélectionné
    // Le hook le fait déjà au moment du submit, mais on peut le forcer ici aussi si besoin.
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    // Idéalement, le hook devrait aussi avoir une fonction pour réinitialiser son état
    // Prediction, taskStatus, error, etc.
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier image.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await submitImageForPrediction(formData);
    } catch (submitError: any) {
      console.error('Submission error in component:', submitError.message);
      // L'erreur est déjà gérée par le hook et stockée dans son état 'error'
    }
  };

  let statusMessage = "";
  if (isLoading && taskStatus?.state === 'PENDING' && taskStatus?.status) {
    statusMessage = taskStatus.status;
  } else if (isLoading && taskStatus?.state !== 'SUCCESS' && taskStatus?.state !== 'FAILURE') {
    statusMessage = `Traitement en cours... (État: ${taskStatus?.state || 'Inconnu'})`;
  }


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Laboratoire d'IA - Test de Détection</CardTitle>
        <CardDescription>
          Uploadez une image d'un déchet pour tester la reconnaissance par l'IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageUploader
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          clearFile={clearFileSelection}
        />

        {selectedFile && (
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? 'Analyse en cours...' : 'Lancer la Prédiction'}
          </Button>
        )}

        {(isLoading && statusMessage) && (
          <div className="mt-4 p-3 text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
            {statusMessage}
          </div>
        )}

        <PredictionResult prediction={prediction} error={error} isLoading={false} />
        {/* On passe isLoading=false à PredictionResult car le message de chargement principal est géré au-dessus */}
      </CardContent>
    </Card>
  );
};

export default AiLabComponent;