// src/app/(dashboard)/ai-lab/page.tsx
import AiLabComponent from "@/components/features/ai-testing/AiLabComponent"; // Ajustez le chemin
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratoire IA - Tribotik",
  description: "Testez la reconnaissance d'images de déchets par l'IA.",
};

export default function AiLabPage() {
  return (
    <div>
      {/* Optionnel: Titre de page */}
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Laboratoire d'Intelligence Artificielle</h1> */}
      <AiLabComponent />
    </div>
  );
}