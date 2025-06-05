// src/components/layout/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Ajustez le chemin
import { Home, ListChecks, TestTube2, Settings, BotMessageSquare, LayoutDashboard } from 'lucide-react'; // Icônes exemples

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'Historique des Tris', icon: ListChecks },
  { href: '/dashboard/ai-lab', label: 'Labo IA', icon: TestTube2 },
  { href: '/dashboard/system', label: 'Système & Logs', icon: Settings },
];

const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <aside className={cn("h-full border-r bg-background dark:bg-gray-900 dark:border-gray-800", className)}>
      <div className="flex h-16 items-center border-b px-6 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="text-lg">Tribotik</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted dark:hover:bg-gray-800",
              pathname === item.href && "bg-muted text-primary dark:bg-gray-800"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;