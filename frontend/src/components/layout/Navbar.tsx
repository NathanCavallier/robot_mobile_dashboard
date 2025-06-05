// src/components/layout/Navbar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'; // Assurez-vous d'avoir Sheet (style Shadcn/ui)
import { Menu, Sun, Moon, UserCircle, LogOut, BotMessageSquare } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme'; // Ajustez le chemin
// import { useAuth } from '@/contexts/AuthContext'; // Si vous avez un contexte d'authentification
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu'; // Assurez-vous d'avoir DropdownMenu (style Shadcn/ui)

const navItems = [ // Dupliqué de Sidebar pour le menu mobile, pourrait être partagé
  { href: '/dashboard', label: 'Vue d\'ensemble' },
  { href: '/dashboard/history', label: 'Historique' },
  { href: '/dashboard/ai-lab', label: 'Labo IA' },
  { href: '/dashboard/system', label: 'Système' },
];


const Navbar = () => {
  const { theme, toggleTheme } = useTheme() || { theme: 'light', toggleTheme: () => {} }; // Fournir des valeurs par défaut
  // const { user, logout } = useAuth() || {}; // Si vous avez un contexte d'authentification
  const pathname = usePathname();

  const user = { name: "Admin User" }; // Placeholder
  const logout = () => alert("Déconnexion simulée"); // Placeholder

    // Utility function to concatenate class names conditionally
    function cn(...classes: (string | false | undefined | null)[]): string {
        return classes.filter(Boolean).join(' ');
    }
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 dark:bg-gray-900/95 dark:border-gray-800">
      {/* Bouton Menu pour mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs dark:bg-gray-950">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <BotMessageSquare className="h-5 w-5 transition-all group-hover:scale-110" /> {/* Assurez-vous que BotMessageSquare est importé */}
              <span className="sr-only">Tribotik</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                  pathname === item.href && "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs ou Titre de la Page (optionnel) */}
      <div className="hidden md:flex">
        {/* <BreadcrumbComponent /> ou un titre dynamique */}
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Barre de recherche (optionnelle) */}
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Rechercher..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" /> */}
      </div>

      {/* Bouton de Thème */}
      <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Changer le thème">
        {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      </Button>

      {/* Menu Utilisateur (Dropdown) - Nécessite un composant DropdownMenu */}
      {/* Exemple si vous avez un DropdownMenu de Shadcn/ui */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user && <DropdownMenuLabel>Mon Compte ({user.name})</DropdownMenuLabel>}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Placeholder simple pour le menu utilisateur */}
       {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden sm:inline">{user.name}</span>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Déconnexion">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

// Vous aurez besoin d'importer Sheet, SheetContent, SheetTrigger depuis votre UI
// et potentiellement DropdownMenu, DropdownMenuTrigger, etc. si vous les utilisez.
// Si vous n'avez pas Sheet, vous pouvez implémenter un menu mobile simple avec de l'état local.
// Exemple de composant Sheet simple si non disponible :
// components/ui/Sheet.tsx
// "use client"
// import * as React from "react"
// import * as DialogPrimitive from "@radix-ui/react-dialog"
// // ... (contenu du composant Sheet de Shadcn/ui)