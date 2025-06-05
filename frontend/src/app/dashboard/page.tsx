// src/app/dashboard/page.tsx
"use client"; // Nécessite des hooks client

import AiRecognitionPanel from "@/components/features/robot-status/AiRecognitionPanel";
import RobotStateDisplay from "@/components/features/robot-status/RobotStateDisplay";
import GripperControl from "@/components/features/manual-controls/GripperControl";
import ModeToggle from "@/components/features/manual-controls/ModeToggle";
import MovementPad from "@/components/features/manual-controls/MovementPad";
import ErrorLogFeed from "@/components/features/sort-history/ErrorLogFeed"; // Peut être utile ici aussi
import { Separator } from "@/components/ui/Separator"; // Si vous avez ce composant UI

export default function DashboardOverviewPage() {
  return (
    <div className="grid gap-6 md:gap-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <RobotStateDisplay />
          <AiRecognitionPanel />
        </div>
        <div className="space-y-6">
          <ModeToggle />
          <MovementPad />
          <GripperControl />
        </div>
      </div>

      {/* Optionnel: Séparateur et section d'erreurs récentes */}
      {typeof Separator === 'function' && <Separator className="my-4" />}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Journal des Erreurs Récentes</h2>
        <ErrorLogFeed maxEntries={3} />
      </div>
    </div>
  );
}