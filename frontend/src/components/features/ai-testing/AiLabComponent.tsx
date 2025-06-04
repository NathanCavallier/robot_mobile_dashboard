// components/features/ai-testing/AiLabComponent.tsx (exemple)
"use client";

import React, { useState, ChangeEvent } from 'react';
import { useWastePrediction } from '@/hooks/useWastePrediction'; // Ajustez le chemin
import { Button } from '@/components/ui/Button'; // Vos composants UI
import { Input } from '@/components/ui/Input';   // Vos composants UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AiLabComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    prediction,
    taskStatus,
    taskId,
    isLoading,
    isUploading,
    error,
    submitImageForPrediction,
  } = useWastePrediction();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // Réinitialiser l'état si un nouveau fichier est sélectionné
      // (déjà géré dans submitImageForPrediction, mais peut être fait ici aussi)
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' doit correspondre au nom attendu par Flask

    try {
      await submitImageForPrediction(formData);
      // Le hook gère la suite (polling et mise à jour de l'état)
    } catch (submitError) {
      // L'erreur est déjà gérée dans le hook et stockée dans 'error'
      console.error('Submission error caught in component:', submitError);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test de l'IA de Tri</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sélectionner une image de déchet
            </label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={isLoading || !selectedFile} className="w-full">
            {isUploading ? 'Envoi en cours...' : isLoading ? 'Analyse en cours...' : 'Prédire le type'}
          </Button>
        </form>

        {taskId && !prediction && !error && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded">
            <p className="text-sm text-blue-700 dark:text-blue-300">Tâche initiée : {taskId}</p>
            {taskStatus && <p className="text-sm">Statut : {taskStatus.state} - {taskStatus.status || ''}</p>}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Erreur :</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {prediction && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Résultat de la Prédiction :</h3>
            <p className="text-md">Type : <span className="font-bold">{prediction.className}</span></p>
            <p className="text-md">Confiance : <span className="font-bold">{typeof prediction.confidence === 'number' ? (prediction.confidence * 100).toFixed(2) + '%' : prediction.confidence}</span></p>
          </div>
        )}

        {selectedFile && (
            <div className="mt-4">
                <p className="text-sm font-medium">Aperçu :</p>
                <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Aperçu du déchet"
                    className="mt-2 max-w-full h-auto rounded border"
                    style={{ maxHeight: '200px' }}
                />
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiLabComponent;