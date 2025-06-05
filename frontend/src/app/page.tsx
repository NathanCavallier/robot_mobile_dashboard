// src/app/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  // Rediriger directement vers le dashboard pour cet exemple
  // Dans un vrai projet, vous pourriez avoir une landing page ici.
  //redirect('/dashboard');

  // Ou, si vous voulez une page simple :
  return (
     <main className="flex min-h-screen flex-col items-center justify-center p-24">
       <h1 className="text-4xl font-bold">Bienvenue sur Tribotik</h1>
       <p className="mt-4 text-lg">Le robot qui trie pour que vous respiriez.</p>
       <Link href="/dashboard" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
         Accéder au Dashboard
       </Link>
     </main>
  );
}