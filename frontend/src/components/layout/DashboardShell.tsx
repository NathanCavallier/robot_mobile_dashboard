// src/components/layout/DashboardShell.tsx
"use client";

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardShellProps {
  children: ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-gray-950">
      <Sidebar className="hidden md:block fixed left-0 top-0 h-full w-[250px] z-40" /> {/* Sidebar fixe pour desktop */}
      <div className="flex flex-col md:pl-[250px]"> {/* Contenu principal avec décalage pour la sidebar */}
        <Navbar /> {/* Navbar sera sticky/fixe */}
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-8">
          {children}
        </main>
        <footer className="text-center p-4 text-xs text-muted-foreground border-t dark:border-gray-800">
            © {new Date().getFullYear()} Tribotik - Il trie, vous respirez.
        </footer>
      </div>
    </div>
  );
};

export default DashboardShell;