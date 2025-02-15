
'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function ProfileElecteur() {
  const [electeur, setElecteur] = useState(null);
  const [candidats, setCandidats] = useState([]);
  const [candidatSelectionne, setCandidatSelectionne] = useState(null);
  const [confirmation, setConfirmation] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    // Dans un cas réel, ces données viendraient d'une API
    const electeurData = {
      id: "E12345",
      nom: "Dupont",
      prenom: "Marie",
      dateNaissance: "15/04/1980",
      adresse: "123 Avenue de la République, 75011 Paris",
      bureauVote: "École Jean Jaurès - Bureau 7",
      numeroElecteur: "751180123456",
      photo: "/api/placeholder/64/64" // Placeholder pour la photo de profil
    };

    const candidatsData = [
      { id: 1, nom: "Martin", prenom: "Jean", parti: "Parti des Citoyens Unis", programme: "https://www.parti-cu.fr/programme", photo: "/api/placeholder/48/48" },
      { id: 2, nom: "Dubois", prenom: "Sophie", parti: "Mouvement pour l'Avenir", programme: "https://www.mpa-2024.fr/programme", photo: "/api/placeholder/48/48" },
      { id: 3, nom: "Bernard", prenom: "Philippe", parti: "Alliance Démocratique", programme: "https://www.alliance-demo.fr/programme", photo: "/api/placeholder/48/48" },
      { id: 4, nom: "Petit", prenom: "Claire", parti: "Union Progressiste", programme: "https://www.union-prog.fr/programme", photo: "/api/placeholder/48/48" },
      { id: 5, nom: "Robert", prenom: "Michel", parti: "Rassemblement National Populaire", programme: "https://www.rnp-officiel.fr/programme", photo: "/api/placeholder/48/48" },
    ];

    setElecteur(electeurData);
    setCandidats(candidatsData);
  }, []);

  const handleParrainage = (candidat) => {
    setCandidatSelectionne(candidat);
    setConfirmation(true);
  };

  const confirmerParrainage = () => {
    // Simulation de l'envoi des données à une API
    console.log(`Parrainage confirmé pour ${candidatSelectionne.prenom} ${candidatSelectionne.nom}`);
    alert(`Vous avez parrainé ${candidatSelectionne.prenom} ${candidatSelectionne.nom} avec succès!`);
    setConfirmation(false);
    setCandidatSelectionne(null);
  };

  const annulerParrainage = () => {
    setConfirmation(false);
    setCandidatSelectionne(null);
  };

  if (!electeur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Espace Électeur - Parrainage</title>
        <meta name="description" content="Interface de parrainage pour les électeurs" />
      </Head>

      {/* En-tête */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Espace Électeur</h1>
          <p className="mt-1 text-blue-100">Plateforme de parrainage des candidats</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Section profil */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-blue-50 p-6 flex items-center justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={electeur.photo}
                  alt={`Photo de ${electeur.prenom} ${electeur.nom}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="p-6 md:p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-blue-700 font-semibold mb-1">Profil électeur</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{electeur.prenom} {electeur.nom}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium text-gray-800">{electeur.dateNaissance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numéro d'électeur</p>
                  <p className="font-medium text-gray-800">{electeur.numeroElecteur}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-800">{electeur.adresse}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Bureau de vote</p>
                  <p className="font-medium text-gray-800">{electeur.bureauVote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section candidats */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidats disponibles pour parrainage</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          {candidats.map(candidat => (
            <div key={candidat.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-gray-50 p-4 flex items-center justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow">
                    <Image
                      src={candidat.photo}
                      alt={`Photo de ${candidat.prenom} ${candidat.nom}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="p-6 md:p-8 w-full">
                  <h3 className="text-xl font-bold text-gray-900">{candidat.prenom} {candidat.nom}</h3>
                  <p className="text-md text-gray-600 mb-4">{candidat.parti}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <a 
                      href={candidat.programme} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                      </svg>
                      Consulter le programme
                    </a>
                    <button 
                      onClick={() => handleParrainage(candidat)}
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Parrainer ce candidat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">© 2025 Système de Parrainage Électoral - Tous droits réservés</p>
        </div>
      </footer>

      {/* Modal de confirmation */}
      {confirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer le parrainage</h3>
            <div className="mb-4 bg-blue-50 p-4 rounded-md flex items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow mr-4">
                <Image
                  src={candidatSelectionne.photo}
                  alt={`Photo de ${candidatSelectionne.prenom} ${candidatSelectionne.nom}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {candidatSelectionne.prenom} {candidatSelectionne.nom}
                </p>
                <p className="text-sm text-gray-600">{candidatSelectionne.parti}</p>
              </div>
            </div>
            <p className="mb-6 text-gray-700">
              Cette action est définitive et ne pourra pas être modifiée. 
              Souhaitez-vous confirmer votre parrainage ?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={annulerParrainage}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200"
              >
                Annuler
              </button>
              <button 
                onClick={confirmerParrainage}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow transition-colors duration-200"
              >
                Confirmer le parrainage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}