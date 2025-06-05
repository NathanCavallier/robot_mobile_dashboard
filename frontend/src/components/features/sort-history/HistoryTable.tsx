// src/components/features/sort-history/HistoryTable.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRobot } from '@/hooks/useRobotState'; // Ajustez le chemin
import { RobotLog } from '@/types/robot';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"; // Assurez-vous d'avoir ces composants
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from "@/components/ui/Badge"; // Assurez-vous d'avoir ce composant

const ITEMS_PER_PAGE = 10;

const HistoryTable = () => {
  const { logs, paginatedLogsInfo, isLoadingLogs, errorLogs, fetchLogs } = useRobot();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLogs(currentPage, ITEMS_PER_PAGE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Refetch quand la page change

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paginatedLogsInfo && currentPage < paginatedLogsInfo.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoadingLogs && !logs.length) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Chargement de l'historique...</div>;
  }

  if (errorLogs) {
    return <div className="p-4 text-red-600 dark:text-red-400">Erreur de chargement de l'historique : {errorLogs}</div>;
  }

  if (!logs.length) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center"><Info className="mr-2 h-5 w-5"/>Aucun historique de tri disponible.</div>;
  }

  const getStatusIcon = (log: RobotLog) => {
    if (log.eventType === 'SORT_ATTEMPT') {
      return log.sortSuccessful ?
        <CheckCircle className="h-5 w-5 text-green-500" /> :
        <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  const getEventTypeLabel = (type: RobotLog['eventType']) => {
    switch(type) {
        case 'DETECTION': return "Détection";
        case 'SORT_ATTEMPT': return "Tentative de Tri";
        case 'STATUS_UPDATE': return "Mise à Jour Statut";
        case 'MANUAL_COMMAND': return "Commande Manuelle";
        case 'SYSTEM_ERROR': return "Erreur Système";
        case 'MODE_CHANGE': return "Changement Mode";
        default: return type;
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Statut</TableHead>
            <TableHead>Type Événement</TableHead>
            <TableHead>Objet Détecté</TableHead>
            <TableHead>Confiance</TableHead>
            <TableHead>Bac Cible</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>{getStatusIcon(log)}</TableCell>
              <TableCell>
                <Badge variant={
                    log.eventType === 'SYSTEM_ERROR' ? 'destructive' :
                    log.eventType === 'SORT_ATTEMPT' && !log.sortSuccessful ? 'warning' : // Shadcn/ui n'a pas de 'warning' par défaut
                    log.eventType === 'SORT_ATTEMPT' && log.sortSuccessful ? 'success' : // Shadcn/ui n'a pas de 'success' par défaut
                    'outline'
                }>
                    {getEventTypeLabel(log.eventType)}
                </Badge>
              </TableCell>
              <TableCell>{log.detectedObject || 'N/A'}</TableCell>
              <TableCell>
                {log.confidence !== undefined ? `${(log.confidence * 100).toFixed(0)}%` : 'N/A'}
              </TableCell>
              <TableCell>{log.targetBin || 'N/A'}</TableCell>
              <TableCell className="text-right">{new Date(log.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {paginatedLogsInfo && paginatedLogsInfo.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoadingLogs}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {paginatedLogsInfo.currentPage} sur {paginatedLogsInfo.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === paginatedLogsInfo.totalPages || isLoadingLogs}
          >
            Suivant <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;