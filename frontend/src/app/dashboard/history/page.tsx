// src/app/(dashboard)/history/page.tsx
"use client"; // Ce composant utilise des hooks et des états

import HistoryTable from "@/components/features/sort-history/HistoryTable";
import StatisticsChart from "@/components/features/sort-history/StatisticsChart";
import ErrorLogFeed from "@/components/features/sort-history/ErrorLogFeed";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
// import { Metadata } from "next"; // Metadata ne peut pas être dans un client component

// Si vous voulez des métadonnées, elles doivent être exportées depuis un Server Component
// Vous pouvez créer un fichier `head.tsx` ou les mettre dans le layout si elles sont statiques.
// Pour des métadonnées dynamiques dans un client component, c'est plus complexe.

// export const metadata: Metadata = {
//   title: "Historique & Statistiques - Tribotik",
// };

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Tris</CardTitle>
          <CardDescription>Consultez l'historique de tous les événements de tri et de détection.</CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Tri</CardTitle>
          <CardDescription>Visualisez les performances et les types de déchets triés.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatisticsChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal des Erreurs et Échecs de Détection</CardTitle>
          <CardDescription>Suivez les problèmes rencontrés par le robot.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorLogFeed maxEntries={10} />
        </CardContent>
      </Card>
    </div>
  );
}