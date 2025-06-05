// services/robotService.ts
import apiClient from './apiClient';
import {
  RobotLog,
  PaginatedRobotLogs,
  RobotState,
  RobotConfiguration,
  WastePrediction, // Assurez-vous que ce type est défini dans vos types/
  CommandPayload,  // Assurez-vous que ce type est défini
  User, // Assurez-vous que ce type est défini dans vos types/
  TaskStatusResponse, // Si vous avez un type pour la réponse de statut de tâche
  LoginCredentials, // Assurez-vous que ce type est défini dans vos types/
  AuthResponse, // Assurez-vous que ce type est défini dans vos types/
  InitiatePredictionResponse, // Si vous avez un type pour l'initiation de la prédiction
} from '../types/robot'; // Assurez-vous que les chemins et types sont corrects

// --- Fonctions pour Robot Logs ---
export const createRobotLogEntry = async (logData: Partial<RobotLog>): Promise<RobotLog> => {
  const response = await apiClient.post<RobotLog>('/logs', logData);
  return response.data;
};

export async function getRobotLogs({ page = 1, limit = 20, filters = {} // ex: { eventType: 'DETECTION' }
}: { page?: number; limit?: number; filters?: Record<string, any>; } = {}): Promise<PaginatedRobotLogs> {
  const response = await apiClient.get<PaginatedRobotLogs>('/logs', {
    params: { page, limit, ...filters },
  });
  return response.data;
}

// --- Fonctions pour Robot State ---
export async function getRobotCurrentState(robotId?: string): Promise<RobotState> {
  const params = robotId ? { robotId } : {};
  const response = await apiClient.get<RobotState>('/robot/state', { params });
  return response.data;
}

// Note: La mise à jour de l'état est généralement faite par le robot/backend,
// mais vous pourriez avoir une route pour des mises à jour spécifiques depuis le dashboard si nécessaire.
// export const updateRobotStateFromDashboard = async (stateUpdate: Partial<RobotState>): Promise<RobotState> => {
//   const response = await apiClient.put<RobotState>('/robot/state', stateUpdate); // Adaptez la route si différente
//   return response.data;
// };

export const sendRobotCommand = async (command: CommandPayload): Promise<{ message: string }> => {
  // CommandPayload pourrait être { command: string, value?: any, robotId?: string }
  const response = await apiClient.post<{ message: string }>('/robot/command', command);
  return response.data;
};


// --- Fonctions pour Robot Configuration ---
export const getRobotConfig = async (robotId?: string): Promise<RobotConfiguration> => {
  const params = robotId ? { robotId } : {};
  const response = await apiClient.get<RobotConfiguration>('/robot/config', { params });
  return response.data;
};

export const updateRobotConfig = async (
  configData: Partial<RobotConfiguration>,
  robotId?: string
): Promise<RobotConfiguration> => {
  const payload = robotId ? { ...configData, robotId } : configData;
  const response = await apiClient.put<RobotConfiguration>('/robot/config', payload);
  return response.data;
};

// --- Fonctions pour l'IA et la détection ---
export const predictWasteFromImage = async (formData: FormData): Promise<WastePrediction> => {
  // Le serveur Flask doit être configuré pour accepter 'multipart/form-data'
  // Le nom du champ 'image' doit correspondre à ce que le serveur Flask attend.
  const response = await apiClient.post<WastePrediction>('/predict/image', formData, { // Adaptez l'URL de l'API Flask
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // Si votre API Flask est sur un autre port/domaine que votre backend Node.js
    // baseURL: process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000/api', // Décommentez et ajustez
  });
  return response.data;
};


// Ajoutez d'autres fonctions d'API selon les besoins de votre backend
// Par exemple pour l'authentification :
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  if (response.data.token && typeof window !== 'undefined') {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

export const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
  // Optionnel: appeler une route backend de déconnexion si nécessaire
  await apiClient.post('/auth/logout');
};

export const getLoggedInUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/profile');
  return response.data;
}


/**
 * @desc Envoie une image pour prédiction et retourne l'ID de la tâche asynchrone.
 */
export const initiateWastePrediction = async (formData: FormData): Promise<InitiatePredictionResponse> => {
  // L'URL de base de apiClient pointe vers votre backend Node.js.
  // Si Flask est sur un autre port/domaine, configurez une instance Axios séparée ou ajustez la baseURL.
  // Pour cet exemple, supposons que NEXT_PUBLIC_FLASK_API_URL est défini dans .env.local
  const flaskApiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000'; // Port par défaut de Flask

  const response = await apiClient.post<InitiatePredictionResponse>(`${flaskApiUrl}/predict`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * @desc Interroge le statut d'une tâche de prédiction.
 */
export const getWastePredictionResult = async (taskId: string): Promise<TaskStatusResponse> => {
  const flaskApiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000';

  const response = await apiClient.get<TaskStatusResponse>(`${flaskApiUrl}/predict/status/${taskId}`);
  return response.data;
};