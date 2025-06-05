// src/app/(dashboard)/layout.tsx
import DashboardShell from '@/components/layout/DashboardShell'; // Ajustez le chemin
import { ReactNode, Suspense } from 'react';

export default function DashboardAppLayout({ children }: { children: ReactNode }) {
  return (
    // Suspense est utile si des composants enfants utilisent des Server Components asynchrones
    // ou des fonctionnalités comme useSearchParams, usePathname côté client.
    <Suspense fallback={<div>Chargement du layout du dashboard...</div>}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </Suspense>
  );
}