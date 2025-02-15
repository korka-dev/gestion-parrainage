import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const candidates = [
  {
    id: 1,
    name: "Amadou Ba",
    party: "Alliance Pour la République (APR)",
    image: "https://placehold.co/400x400",
    program: {
      economy: "Développement économique et création d'emplois",
      education: "Réforme du système éducatif",
      health: "Amélioration du système de santé",
      infrastructure: "Modernisation des infrastructures"
    }
  },
  {
    id: 2,
    name: "Bassirou Diomaye Faye",
    party: "PASTEF",
    image: "https://placehold.co/400x400",
    program: {
      economy: "Souveraineté économique et industrialisation",
      education: "Formation professionnelle et technique",
      health: "Couverture sanitaire universelle",
      infrastructure: "Développement rural et urbain"
    }
  },
  {
    id: 3,
    name: "Khalifa Sall",
    party: "Taxawu Sénégal",
    image: "https://placehold.co/400x400",
    program: {
      economy: "Relance économique et emploi des jeunes",
      education: "Modernisation de l'éducation",
      health: "Accès aux soins de santé",
      infrastructure: "Développement des transports"
    }
  }
];

export default function CandidatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Accueil
              </Link>
              <Link href="/candidats" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Candidats
              </Link>
              <Link href="/verification" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Vérification
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{candidate.name}</h2>
                <p className="text-green-600 font-semibold mb-4">{candidate.party}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Programme</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">Économie</h4>
                    <p className="text-gray-600">{candidate.program.economy}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">Éducation</h4>
                    <p className="text-gray-600">{candidate.program.education}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">Santé</h4>
                    <p className="text-gray-600">{candidate.program.health}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">Infrastructure</h4>
                    <p className="text-gray-600">{candidate.program.infrastructure}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Parrainer ce candidat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}