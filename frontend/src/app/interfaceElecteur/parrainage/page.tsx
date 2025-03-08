"use client";

import { useEffect, useState } from 'react';
import { getAllCandidats } from '../../api/candidats/getAllCandidat';
import { CandidatInfo } from '../../types/candidat';
import Link from 'next/link';
import { Plus } from 'lucide-react';
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

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header className="bg-green-600 fixed top-0 left-0 right-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Accueil
                            </Link>
                            <Link href="/interfaceCandidat/register" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Candidats
                            </Link>
                            <Link href="/verification" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Vérification
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main content with top padding to account for fixed header */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {tempError && (
                    <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        {tempError}
                    </div>
                )}
                
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
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Programmes</h3>
                                <div className="space-y-2">
                                    {getProgrammeLines(candidate.programme).map((programLine, index) => (
                                        <div key={index} className="flex items-center">
                                            <p className="flex-grow text-gray-700 text-sm">{programLine}</p>
                                            <button
                                                onClick={() => toggleProgramDetail(candidate.id, programLine)}
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {expandedPrograms[candidate.id] && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                    <h4 className="font-semibold mb-2 text-sm">Détails supplémentaires</h4>
                                    <ul className="list-disc list-inside">
                                        {expandedPrograms[candidate.id].map((detail, index) => (
                                            <li key={index} className="text-gray-700 text-xs">{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={() => handleSponsorClick(candidate)}
                                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
                                >
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