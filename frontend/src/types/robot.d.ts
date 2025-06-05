// Exemple de types/robot.d.ts
export interface RobotLog {
    _id: string;
    timestamp: number;
    eventType: 'DETECTION' | 'SORT_ATTEMPT' | 'STATUS_UPDATE' | 'MANUAL_COMMAND' | 'SYSTEM_ERROR' | 'MODE_CHANGE';
    detectedObject?: string;
    confidence?: number;
    sortSuccessful?: boolean;
    targetBin?: string;
    batteryLevel?: number;
    motorStatus?: string;
    cameraStatus?: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'INITIALIZING';
    robotMode?: 'AUTONOMOUS' | 'MANUAL' | 'MAINTENANCE' | 'OFFLINE';
    gripperStatus?: 'OPEN' | 'CLOSED' | 'HOLDING' | 'ERROR';
    errorMessage?: string;
    errorCode?: string;
    metadata?: any;
    createdAt: string; // Ajouté par Mongoose (timestamps: true)
    updatedAt: string; // Ajouté par Mongoose (timestamps: true)
}

export interface PaginatedRobotLogs {
    logs: RobotLog[];
    currentPage: number;
    totalPages: number;
    totalLogs: number;
}

export interface RobotState {
    _id: string;
    robotId: string;
    lastSeen: string;
    batteryLevel?: number;
    motorStatus?: string;
    cameraStatus?: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'INITIALIZING';
    currentMode?: 'AUTONOMOUS' | 'MANUAL' | 'MAINTENANCE' | 'OFFLINE';
    gripperStatus?: 'OPEN' | 'CLOSED' | 'HOLDING' | 'ERROR';
    lastDetectedObject?: string;
    lastDetectionConfidence?: number;
    connectionStatus?: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
    currentErrors?: Array<{ message: string; code: string; timestamp: string }>;
    createdAt: string;
    updatedAt: string;
}

export interface RobotConfiguration {
    _id: string;
    robotId: string;
    serialPort?: string;
    wifiSsid?: string;
    bluetoothDeviceName?: string;
    aiModelEndpoint?: string;
    detectionConfidenceThreshold?: number;
    autonomousModeEnabled?: boolean;
    maxMotorSpeed?: number;
    logLevel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    customSettings?: any;
    createdAt: string;
    updatedAt: string;
}


export interface CommandPayload {
    command: string; // e.g., 'MOVE_FORWARD', 'TOGGLE_GRIPPER', 'SET_MODE'
    value?: any;      // e.g., 'AUTONOMOUS', { speed: 50 }
    robotId?: string;
}

// Types pour l'authentification (si vous les mettez ici)
export interface LoginCredentials { 
    email: string; 
    password: string; 
}

export interface User { 
    _id: string; 
    username: string; 
    email: string; 
    role: 'user' | 'admin'; 
}

export interface AuthResponse extends User { 
    token: string; 
}

export interface InitiatePredictionResponse {
  task_id: string;
}

export interface TaskStatusResponse {
  state: 'PENDING' | 'SUCCESS' | 'FAILURE' | 'PROGRESS' | 'RETRY' | 'STARTED'; // États Celery
  status?: string; // Message de statut ou progression
  result?: WastePrediction; // Le résultat de la prédiction si SUCCESS
  error?: string; // Message d'erreur si FAILURE
}

// Mettez à jour WastePrediction si nécessaire pour correspondre à la sortie de Flask
export interface WastePrediction {
  className: string;
  confidence: number | string; // Peut être 'N/A (OpenAI)'
}
