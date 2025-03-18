"use client";

import { useEffect, useState } from 'react';
import { getAllCandidats } from '../../api/candidats/getAllCandidat';
import { CandidatInfo } from '../../types/candidat';
import Link from 'next/link';
import { User, LogIn, UserCheck, Plus, Menu, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (tempError) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [tempError]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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

    const handleLogin = () => {
        router.push('/interfaceElecteur/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-green-600 font-medium">Chargement en cours...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-red-100">
                    <div className="text-red-500 text-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2">Erreur</h2>
                    <p className="text-gray-600 text-center">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-300"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-500 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo et nom */}
                            <img
                                src="/images/logo-sn.jpg"
                                alt="Logo"
                                className="h-10 w-10 mr-2 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
                        </div>
                        
                        {/* Menu pour écrans plus larges */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors">
                                Accueil
                            </Link>
                            <Link href="/interfaceElecteur/acceuilParrainage" className="text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors">
                                Parrainage
                            </Link>
                            <button
                                onClick={handleLogin}
                                className="w-full text-left bg-white text-green-600 px-3 py-2 rounded-md hover:bg-green-50 transition-colors flex items-center border border-green-100"
                            >
                                <LogIn size={18} className="mr-1" />
                                Connexion / Inscription
                            </button>
                        </div>
                        
                        {/* Bouton menu pour mobile */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-white p-2 focus:outline-none">
                                {isMenuOpen ? (
                                    <X size={24} className="text-white" />
                                ) : (
                                    <Menu size={24} className="text-white" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Menu mobile */}
                {isMenuOpen && (
                    <div className="md:hidden bg-green-700 shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/" 
                                className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link href="/interfaceElecteur/acceuilParrainage" 
                                className="block text-white hover:bg-green-500 px-3 py-2 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Parrainage
                            </Link>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogin();
                                }}
                                className="w-full text-left bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <LogIn size={18} className="mr-1" />
                                Connexion / Inscription
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main content with top padding to account for fixed header */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {tempError && (
                    <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        {tempError}
                    </div>
                )}
                
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Candidats à l'élection</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les candidats et leurs programmes électoraux pour les prochaines élections</p>
                    <div className="mt-4 w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {candidats.map((candidate) => (
                        <div
                            key={candidate.id}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-center mb-5">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                        {candidate.prenom} {candidate.nom}
                                    </h2>
                                    <div className="flex items-center">
                                        <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                                        <p className="text-gray-600 font-medium">{candidate.parti}</p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center shadow-md">
                                    <User size={30} className="text-green-600" />
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
                                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    Programme électoral
                                </h3>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                                    {getProgrammeLines(candidate.programme).map((programLine, index) => (
                                        <div key={index} className="flex items-center p-2 hover:bg-white rounded-lg transition-colors duration-200 border-l-2 border-green-200">
                                            <p className="flex-grow text-gray-700">{programLine}</p>
                                            <button
                                                onClick={() => toggleProgramDetail(candidate.id, programLine)}
                                                className="ml-2 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors duration-200"
                                                aria-label="Voir plus de détails"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {expandedPrograms[candidate.id] && expandedPrograms[candidate.id].length > 0 && (
                                <div className="mt-5 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                                    <h4 className="font-semibold mb-3 text-sm text-green-700">Détails supplémentaires</h4>
                                    <ul className="space-y-2">
                                        {expandedPrograms[candidate.id].map((detail, index) => (
                                            <li key={index} className="text-gray-700 text-sm flex items-start">
                                                <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2 mt-1.5"></span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
