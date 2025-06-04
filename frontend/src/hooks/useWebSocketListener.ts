// hooks/useWebSocketListener.ts
import { useEffect, useRef } from 'react';
import { subscribeToEvent, getSocket, ServerToClientEvents } from '../services/websocketService'; // Adaptez

/**
 * Hook personnalisé pour s'abonner à un événement WebSocket spécifique.
 * @param eventName Nom de l'événement WebSocket à écouter.
 * @param callback Fonction à exécuter lorsque l'événement est reçu.
 */
const useWebSocketListener = <E extends keyof ServerToClientEvents>(
  eventName: E,
  callback: ServerToClientEvents[E]
): void => {
  // Utiliser une ref pour la callback pour éviter de recréer l'abonnement si la callback change souvent
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const socket = getSocket(); // Tente de récupérer le socket existant (initialisé par RobotContext ou ailleurs)

    if (!socket) {
      console.warn(`WebSocket not initialized. Cannot listen to event: ${String(eventName)}`);
      // Vous pourriez vouloir forcer une connexion ici si nécessaire:
      // connectWebSocket(); // Mais attention aux connexions multiples
      return;
    }

    // S'assurer que le socket est connecté avant de s'abonner
    // (subscribeToEvent peut le gérer, mais une vérification ici est bien)
    if (!socket.connected) {
        // On peut attendre l'événement 'connect' ou laisser subscribeToEvent gérer
        // console.warn(`Socket not connected. Listener for ${String(eventName)} will be active upon connection.`);
    }

    const currentCallback = (data: Parameters<ServerToClientEvents[E]>[0]) => {
        if (callbackRef.current) {
            callbackRef.current(data as any); // Type assertion peut être nécessaire
        }
    };

    const unsubscribe = subscribeToEvent(
      eventName as Parameters<typeof subscribeToEvent>[0],
      currentCallback as Parameters<typeof subscribeToEvent>[1]
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [eventName]); // Se réabonne si eventName change
};

export default useWebSocketListener;