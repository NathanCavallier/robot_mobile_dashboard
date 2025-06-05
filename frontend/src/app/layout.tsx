import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RobotProvider } from '@/contexts/RobotContext';
import { Toaster } from 'sonner'; // Si vous utilisez Sonner pour les notifications
import './globals.css';
import { cn } from '@/lib/utils'; // Ajustez le chemin

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Tableau de bord TriboTik",
  description: "Tableau de bord pour la gestion des robots TriboTik",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning = {true}> {/* suppressHydrationWarning pour le thème */}
      <body
        className={cn(
          "min-h-screen flex flex-col",
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          "bg-background text-foreground"
        )}
      >
        <ThemeProvider
          defaultTheme="system" // Peut être 'light', 'dark' ou 'system'
          // Vous pouvez ajouter d'autres props ici si nécessaire
          storageKey="tribotik-theme"
        >
          <RobotProvider> {/* RobotProvider enveloppe les parties qui ont besoin de son contexte */}
            {children}
            <Toaster richColors position="top-right" /> {/* Pour les notifications (Sonner) */}
          </RobotProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
