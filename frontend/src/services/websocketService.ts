// services/websocketService.ts
import { io, Socket } from 'socket.io-client';
import { RobotState, RobotLog } from '../types/robot'; // Adaptez les types

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5001';

let socket: Socket | null = null;

export interface ServerToClientEvents {
  // Événements que le serveur envoie au client
  robot_state_update: (state: RobotState) => void;
  new_robot_log: (log: RobotLog) => void;
  // Ajoutez d'autres événements ici si nécessaire
  // ex: 'detection_error': (error: { message: string; code?: string }) => void;
}

interface ClientToServerEvents {
  // Événements que le client peut envoyer au serveur (moins courant pour le dashboard,
  // sauf pour des actions spécifiques via WebSocket au lieu de HTTP)
  // ex: 'request_robot_action': (action: { type: string; payload?: any }) => void;
}


export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> | null => {
  if (!socket && typeof window !== 'undefined') { // Assurer que le code s'exécute côté client
    socket = io(WS_URL, {
      // autoConnect: false, // Décommentez si vous voulez contrôler la connexion manuellement
      // Vous pouvez ajouter des options de transport, authentification, etc. ici
      // withCredentials: true, // Si vous utilisez des cookies pour l'auth WebSocket
      // auth: { token: localStorage.getItem('authToken') } // Si vous passez un token pour l'auth WebSocket
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      // Vous pourriez vouloir implémenter une logique de reconnexion ici si autoConnect est false
      // ou si vous voulez gérer des raisons spécifiques de déconnexion.
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Vous pouvez ajouter des listeners globaux ici si nécessaire,
    // mais il est souvent préférable de les gérer dans les composants/hooks
    // qui utilisent le socket.
  }
  return socket;
};

export const connectWebSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> | null => {
  const currentSocket = getSocket();
  if (currentSocket && !currentSocket.connected) {
    currentSocket.connect();
  }
  return currentSocket;
};

export const disconnectWebSocket = (): void => {
  const currentSocket = getSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.disconnect();
  }
  socket = null; // Pour permettre une nouvelle initialisation si nécessaire
};

// Fonctions d'aide pour s'abonner et se désabonner facilement aux événements
// Surcharges pour chaque événement spécifique
function subscribeToEvent(
  eventName: 'robot_state_update',
  callback: (state: RobotState) => void
): (() => void) | undefined;
function subscribeToEvent(
  eventName: 'new_robot_log',
  callback: (log: RobotLog) => void
): (() => void) | undefined;
// Ajoutez d'autres surcharges ici si vous avez plus d'événements dans ServerToClientEvents

// Implémentation générique (utilisée par les surcharges)
function subscribeToEvent<K extends keyof ServerToClientEvents>(
  eventName: K,
  callback: ServerToClientEvents[K]
): (() => void) | undefined {
  const currentSocket = getSocket();
  if (currentSocket) {
    // Ici, grâce aux surcharges, TypeScript devrait mieux inférer
    currentSocket.on(eventName, callback);
    return () => currentSocket.off(eventName, callback);
  }
  console.warn('Socket not initialized, cannot subscribe to event:', eventName);
  return undefined;
}

export { subscribeToEvent }; // Exporter la fonction surchargée

// Si vous avez besoin d'émettre des événements du client vers le serveur
// export const emitEvent = <T extends keyof ClientToServerEvents>(
//   eventName: T,
//   data: Parameters<ClientToServerEvents[T]>[0]
// ): void => {
//   const currentSocket = getSocket();
//   if (currentSocket && currentSocket.connected) {
//     currentSocket.emit(eventName, data);
//   } else {
//     console.warn('Socket not connected, cannot emit event:', eventName);
//   }
// };

// Assurez-vous de déconnecter le socket lorsque l'application se ferme ou que l'utilisateur se déconnecte
// Cela peut être géré dans un layout global ou un contexte d'authentification.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    disconnectWebSocket();
  });
}