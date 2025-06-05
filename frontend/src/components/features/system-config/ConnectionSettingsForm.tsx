// src/components/features/system-config/ConnectionSettingsForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label'; // Assurez-vous d'avoir ce composant
import { RobotConfiguration } from '@/types/robot';
import { toast } from 'sonner'; // Supposant que vous utilisez sonner pour les notifications

const ConnectionSettingsForm = () => {
  const { robotConfig, updateRobotConfig, isLoadingConfig, errorConfig, fetchRobotConfig } = useRobot();
  const [formData, setFormData] = useState<Partial<RobotConfiguration>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (robotConfig) {
      setFormData({
        serialPort: robotConfig.serialPort || '',
        wifiSsid: robotConfig.wifiSsid || '',
        // Ne pas charger le mot de passe WiFi s'il est stocké (sécurité)
        bluetoothDeviceName: robotConfig.bluetoothDeviceName || '',
        aiModelEndpoint: robotConfig.aiModelEndpoint || '',
      });
    }
  }, [robotConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRobotConfig(formData);
      toast.success("Configuration de connexion mise à jour !");
      // Optionnel : rafraîchir la config si l'update ne met pas à jour le contexte immédiatement
      // await fetchRobotConfig();
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour : ${err.message || 'Erreur inconnue'}`);
      console.error("Failed to update connection settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingConfig && !robotConfig) {
    return <div className="p-4 text-gray-500 dark:text-gray-400">Chargement de la configuration...</div>;
  }
  if (errorConfig) {
    return <div className="p-4 text-red-600 dark:text-red-400">Erreur: {errorConfig}</div>;
  }
  if (!robotConfig) {
    return <div className="p-4 text-yellow-600 dark:text-yellow-400">Configuration non disponible.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <div>
        <Label htmlFor="aiModelEndpoint">Endpoint API IA (Flask)</Label>
        <Input
          id="aiModelEndpoint"
          name="aiModelEndpoint"
          type="url"
          value={formData.aiModelEndpoint || ''}
          onChange={handleChange}
          placeholder="http://localhost:5000/predict"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URL du serveur Flask pour la prédiction d'images.</p>
      </div>

      <div>
        <Label htmlFor="serialPort">Port Série (Arduino/ESP32)</Label>
        <Input
          id="serialPort"
          name="serialPort"
          type="text"
          value={formData.serialPort || ''}
          onChange={handleChange}
          placeholder="/dev/ttyUSB0 ou COM3"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="wifiSsid">SSID WiFi</Label>
        <Input
          id="wifiSsid"
          name="wifiSsid"
          type="text"
          value={formData.wifiSsid || ''}
          onChange={handleChange}
          placeholder="Nom_De_Votre_Reseau_WiFi"
          className="mt-1"
        />
      </div>
      {/* Ne pas inclure le champ de mot de passe WiFi pour la lecture/affichage par sécurité.
          La mise à jour du mot de passe devrait être un champ séparé, non pré-rempli.
      <div>
        <Label htmlFor="wifiPassword">Mot de passe WiFi</Label>
        <Input id="wifiPassword" name="wifiPassword" type="password" placeholder="********" className="mt-1" />
      </div>
      */}

      <div>
        <Label htmlFor="bluetoothDeviceName">Nom Appareil Bluetooth</Label>
        <Input
          id="bluetoothDeviceName"
          name="bluetoothDeviceName"
          type="text"
          value={formData.bluetoothDeviceName || ''}
          onChange={handleChange}
          placeholder="Tribotik_BT"
          className="mt-1"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || isLoadingConfig} className="w-full sm:w-auto">
        {isSubmitting ? 'Sauvegarde en cours...' : 'Sauvegarder les Paramètres'}
      </Button>
    </form>
  );
};

export default ConnectionSettingsForm;