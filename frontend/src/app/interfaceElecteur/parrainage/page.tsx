"use client";

import { useEffect, useState } from 'react';
import { getAllCandidats } from '../../api/candidats/getAllCandidat';
import { CandidatInfo } from '../../types/candidat';
import Link from 'next/link';
import { Plus, User, LogOut, Home, UserCheck, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

function useCandidats() {
    const [candidats, setCandidats] = useState<CandidatInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCandidats() {
            const result = await getAllCandidats();
            if (result.success) {
                setCandidats(result.data!);
            } else {
                setError(result.error ?? null);
            }
            setLoading(false);
        }

        fetchCandidats();
    }, []);

    return { candidats, loading, error };
}

export default function CandidatesPage() {
    const { candidats, loading, error } = useCandidats();
    const [expandedPrograms, setExpandedPrograms] = useState<{ [key: string]: string[] }>({});
    const [tempError, setTempError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (tempError) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000); // Reload after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [tempError]);

    const toggleProgramDetail = (candidateId: string, newDetail: string) => {
        setExpandedPrograms(prev => ({
            ...prev,
            [candidateId]: prev[candidateId]
                ? [...prev[candidateId], newDetail]
                : [newDetail]
        }));
    };

    const getProgrammeLines = (programme: string | string[]) => {
        return Array.isArray(programme)
            ? programme
            : programme.split('\n');
    };

    const handleSponsorClick = (candidate: CandidatInfo) => {
        // Rediriger vers la page de parrainage avec les informations du candidat, y compris numeroCNI
        router.push(`/interfaceElecteur/confirmeParrainage?candidatId=${candidate.id}&nom=${candidate.nom}&prenom=${candidate.prenom}&numeroCNI=${candidate.numeroCNI}`);
    };

    const handleLogout = () => {
        // Implémentez votre logique de déconnexion ici
        // Par exemple:
        localStorage.removeItem('authToken');
        router.push('/interfaceCandidat/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-green-600 font-medium">Chargement en cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-500 text-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2">Erreur</h2>
                    <p className="text-gray-600 text-center">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header className="bg-green-600 fixed top-0 left-0 right-0 z-50 shadow-md">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="bg-white p-1 rounded-full mr-2">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <UserCheck size={18} className="text-white" />
                                </div>
                            </div>
                            <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
                            >
                                <LogOut size={18} className="mr-1" />
                                Déconnexion
                            </button>
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="bg-green-500 p-2 rounded-md text-white hover:bg-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile navigation menu (hidden by default) */}
            <div className="hidden md:hidden bg-green-700 fixed top-16 left-0 right-0 z-40 shadow-md">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link href="/" className="text-white block px-3 py-2 rounded-md hover:bg-green-500">Accueil</Link>
                    <Link href="/interfaceCandidat/register" className="text-white block px-3 py-2 rounded-md hover:bg-green-500">Candidats</Link>
                    <Link href="/verification" className="text-white block px-3 py-2 rounded-md hover:bg-green-500">Vérification</Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Main content with top padding to account for fixed header */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {tempError && (
                    <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        {tempError}
                    </div>
                )}
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Candidats à l'élection</h1>
                    <p className="text-gray-600">Découvrez les candidats et leurs programmes électoraux</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidats.map((candidate) => (
                        <div
                            key={candidate.id}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {candidate.prenom} {candidate.nom}
                                    </h2>
                                    <p className="text-gray-600 text-sm">{candidate.parti}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <User size={24} className="text-green-600" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Programmes
                                </h3>
                                <div className="space-y-2">
                                    {getProgrammeLines(candidate.programme).map((programLine, index) => (
                                        <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                            <p className="flex-grow text-gray-700 text-sm">{programLine}</p>
                                            <button
                                                onClick={() => toggleProgramDetail(candidate.id, programLine)}
                                                className="ml-2 text-green-500 hover:text-green-700 bg-green-50 p-1 rounded-full"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {expandedPrograms[candidate.id] && (
                                <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                                    <h4 className="font-semibold mb-2 text-sm text-green-700">Détails supplémentaires</h4>
                                    <ul className="list-disc list-inside">
                                        {expandedPrograms[candidate.id].map((detail, index) => (
                                            <li key={index} className="text-gray-700 text-xs">{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-6">
                                <button
                                    onClick={() => handleSponsorClick(candidate)}
                                    className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors text-sm font-medium shadow-sm flex items-center justify-center"
                                >
                                    <UserCheck size={18} className="mr-2" />
                                    Parrainer ce candidat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}