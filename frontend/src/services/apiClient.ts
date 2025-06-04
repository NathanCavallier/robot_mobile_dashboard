// services/apiClient.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Récupérer l'URL du backend depuis les variables d'environnement
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Décommentez si vous utilisez des cookies pour l'authentification
});

// Intercepteur de requête (optionnel, pour ajouter un token d'authentification par exemple)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer le token depuis localStorage ou un store d'état (ex: Zustand, Redux)
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (optionnel, pour gérer les erreurs globalement)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Vous pouvez gérer des erreurs spécifiques ici (ex: 401 Unauthorized pour déconnecter l'utilisateur)
    if (error.response?.status === 401) {
      // Gérer la déconnexion, par exemple rediriger vers la page de login
      console.error('Unauthorized, logging out...');
      if (typeof window !== 'undefined') {
        // localStorage.removeItem('authToken');
        // window.location.href = '/login'; // Adaptez selon votre système de routage et d'auth
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;