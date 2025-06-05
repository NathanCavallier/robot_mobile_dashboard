// src/app/(dashboard)/system/page.tsx
"use client"; // Nécessite des hooks client pour les formulaires et les logs dynamiques

import ConnectionSettingsForm from "@/components/features/system-config/ConnectionSettingsForm";
import SystemLogViewer from "@/components/features/system-config/SystemLogViewer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"; // Si vous avez un composant Tabs

// export const metadata: Metadata = { // Ne peut pas être dans un client component
//   title: "Configuration Système - Tribotik",
// };

export default function SystemPage() {
  // Si vous n'avez pas de composant Tabs, vous pouvez simplement empiler les composants.
  // Ou utiliser un état local pour afficher l'un ou l'autre.
  if (typeof Tabs !== 'function') { // Fallback si Tabs n'est pas un composant valide
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Configuration des Connexions</CardTitle>
                <CardDescription>Gérez les paramètres de connexion du robot et des API.</CardDescription>
                </CardHeader>
                <CardContent>
                <ConnectionSettingsForm />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Journal Système Détaillé</CardTitle>
                <CardDescription>Visualisez les logs système du robot et du backend.</CardDescription>
                </CardHeader>
                <CardContent>
                <SystemLogViewer />
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <Tabs defaultValue="config" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="config">Configuration</TabsTrigger>
        <TabsTrigger value="logs">Journal Système</TabsTrigger>
      </TabsList>
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>Configuration des Connexions</CardTitle>
            <CardDescription>
              Gérez les paramètres de connexion du robot, des API et autres configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConnectionSettingsForm />
            {/* Vous pourriez ajouter d'autres formulaires de configuration ici */}
            {/* Par exemple pour les seuils IA, les paramètres de fonctionnement, etc. */}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="logs">
        <Card>
          <CardHeader>
            <CardTitle>Journal Système Détaillé</CardTitle>
            <CardDescription>
              Visualisez les logs système du robot et du backend pour le débogage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SystemLogViewer />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}