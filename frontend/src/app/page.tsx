  "use client";

  import { UserGroupIcon, DocumentCheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
  import Link from 'next/link';
  import { useState } from 'react';

  export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header fixe */}
        <header className="fixed top-0 left-0 right-0 bg-green-600 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* Image à côté du texte */}
                <img
                  src="/images/logo-sn.jpg" // Remplacez par le chemin de votre image
                  alt="Logo"
                  className="h-10 w-10 mr-2 rounded-full object-cover"
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                />
                <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                  Accueil
                </Link>
                <Link href="/interfaceElecteur/accueilParrainage" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                  Parrainage
                </Link>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="text-white focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                </button>
              </div>
            </div>
            {isMenuOpen && (
              <div className="md:hidden">
                <Link href="/" className="block text-white hover:bg-green-500 px-3 py-2 rounded-md">
                  Accueil
                </Link>
                <Link href="/interfaceElecteur/accueilParrainage" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                  Parrainage
                </Link>
              </div>
            )}
          </nav>
        </header>

        {/* Contenu principal avec un padding en haut pour compenser le header fixe */}
        <main className="flex-grow pt-16">
          {/* Hero Section */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Participez à la démocratie</span>
                  <span className="block text-green-600">Parrainez votre candidat</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Plateforme officielle de parrainage électoral au Sénégal. Simple, sécurisée et transparente pour soutenir votre candidat aux élections.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link href="/interfaceElecteur/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                      S'inscrire
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link href="/interfaceElecteur/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Se connecter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Comment ça marche</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Processus simple et sécurisé
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                  <div className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <UserGroupIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Identification sécurisée</p>
                    <p className="mt-2 ml-16 text-base text-gray-500">
                      Connectez-vous avec votre numéro d&apos;électeur et vos informations personnelles.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <DocumentCheckIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Choix du candidat</p>
                    <p className="mt-2 ml-16 text-base text-gray-500">
                      Sélectionnez le candidat que vous souhaitez parrainer parmi la liste officielle.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Validation sécurisée</p>
                    <p className="mt-2 ml-16 text-base text-gray-500">
                      Confirmez votre parrainage de manière sécurisée avec un code unique envoyé par SMS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center mb-12">
                <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Informations importantes</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Ce qu&apos;il faut savoir
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Conditions de parrainage</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Être inscrit sur les listes électorales</li>
                    <li>Disposer d&apos;une carte d&apos;électeur valide</li>
                    <li>Un électeur ne peut parrainer qu&apos;un seul candidat</li>
                    <li>Le parrainage est définitif une fois validé</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Documents nécessaires</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Numéro de carte d&apos;électeur</li>
                    <li>Numéro d&apos;identification nationale</li>
                    <li>Numéro de téléphone mobile enregistré</li>
                    <li>Scan ou photo de votre carte d&apos;identité</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>      
        <footer className="bg-gray-100 py-4 text-center text-gray-600">
          <p>&copy; 2025 SenParrainage Électoral</p>
        </footer>
      </div>
  );
}