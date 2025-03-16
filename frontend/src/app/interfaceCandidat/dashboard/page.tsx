// pages/Candidat/dashboard.js
'use client';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Calendar, Award, LogOut } from 'lucide-react';
import Head from 'next/head';

export default function CandidatDashboard() {
  // État pour stocker les données du Candidat
  interface Candidat {
    nom: string;
    prenom: string;
    parti: string;
    slogan: string;
    couleurs: string[];
  }

  const [Candidat, setCandidat] = useState<Candidat | null>(null);
  // État pour stocker les données de parrainage
  const [parrainages, setParrainages] = useState<{ date: string; count: number }[]>([]);
  // État pour les statistiques
  const [stats, setStats] = useState({
    total: 0,
    weeklyGrowth: 0,
    daysLeft: 0,
    target: 0
  });
  // État pour le chargement
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    // Ceci serait remplacé par un appel API réel
    setTimeout(() => {
      setCandidat({
        nom: 'Diop',
        prenom: 'Mamadou',
        parti: 'Alliance pour le Progrès',
        slogan: 'Ensemble pour un Sénégal prospère',
        couleurs: ['#009B4D', '#FFD700', '#FF0000']
      });
      
      setParrainages([
        { date: '2025-01-01', count: 120 },
        { date: '2025-01-02', count: 187 },
        { date: '2025-01-03', count: 250 },
        { date: '2025-01-04', count: 325 },
        { date: '2025-01-05', count: 410 },
        { date: '2025-01-06', count: 489 },
        { date: '2025-01-07', count: 578 },
      ]);
      
      setStats({
        total: 578,
        weeklyGrowth: 32,
        daysLeft: 45,
        target: 1500
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tableau de bord - Suivi des Parrainages</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-green-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Élections Présidentielles Sénégal</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {Candidat && (
                  <>
                    <p className="font-semibold">{Candidat.prenom} {Candidat.nom}</p>
                    <p className="text-sm text-green-100">{Candidat.parti}</p>
                  </>
                )}
              </div>
              <button className="p-2 hover:bg-green-700 rounded-full">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Bienvenue */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bienvenue, !</h2>
            {/* <h2 className="text-2xl font-bold mb-2">Bienvenue, {Candidat.prenom}!</h2> */}
            <p className="text-gray-600">Voici le suivi de vos parrainages pour les élections présidentielles</p>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total parrainages</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Users size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+{stats.weeklyGrowth}%</span>
                <span className="text-gray-400 ml-2">cette semaine</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Jours restants</p>
                  <p className="text-2xl font-bold mt-1">{stats.daysLeft}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Fin de la période: </span>
                <span className="text-gray-700 font-medium ml-1">27/02/2025</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Objectif</p>
                  <p className="text-2xl font-bold mt-1">{stats.target}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Award size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (stats.total / stats.target) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{Math.round((stats.total / stats.target) * 100)}% atteint</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Parrainages quotidiens</p>
                  <p className="text-2xl font-bold mt-1">{Math.round(stats.total / 7)}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <Users size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">Parrainages nécessaires: </span>
                <span className="text-gray-700 font-medium ml-1">{Math.ceil((stats.target - stats.total) / stats.daysLeft)}/jour</span>
              </div>
            </div>
          </div>
          
          {/* Graphique */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold mb-4">Évolution des parrainages</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <p className="text-center text-gray-500">Graphique de l'évolution des parrainages par jour</p>
            </div>
          </div>
          
          {/* Tableau des parrainages */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Détail des parrainages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de parrainages
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cumul
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progression
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parrainages.map((parrainage, index) => {
                    // Calculer le cumul
                    const cumul = parrainages
                      .slice(0, index + 1)
                      .reduce((acc, curr) => acc + curr.count, 0);
                    
                    // Calculer la progression
                    const progression = index > 0 
                      ? ((parrainage.count - parrainages[index - 1].count) / parrainages[index - 1].count * 100).toFixed(1)
                      : "N/A";
                    
                    return (
                      <tr key={parrainage.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(parrainage.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {parrainage.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cumul}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {progression !== "N/A" ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              Number(progression) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {Number(progression) > 0 ? '+' : ''}{progression}%
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              N/A
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white py-6 border-t border-gray-200 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Direction Générale des Élections - République du Sénégal</p>
            <p className="mt-2">Plateforme de gestion des parrainages pour les élections présidentielles</p>
          </div>
        </footer>
      </div>
    </>
  );
}