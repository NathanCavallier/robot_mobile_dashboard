import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RobotProvider } from '@/contexts/RobotContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="fr" suppressHydrationWarning> {/* suppressHydrationWarning pour le thème */}
      <body>
        <ThemeProvider
          defaultTheme="light"
          storageKey="tribotik-theme"
        >
          <RobotProvider> {/* RobotProvider enveloppe les parties qui ont besoin de son contexte */}
            {children}
          </RobotProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
