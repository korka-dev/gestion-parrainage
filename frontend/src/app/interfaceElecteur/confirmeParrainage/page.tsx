"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sponsorCandidate } from '../../api/electeurs/parrainage';
import Link from 'next/link';
import { CreditCard, Lock, User, ArrowRight, Menu, X } from 'lucide-react';

export default function ParrainagePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Récupérer les informations du candidat depuis les paramètres d'URL
    const candidatId = searchParams.get('candidatId');
    const nom = searchParams.get('nom');
    const prenom = searchParams.get('prenom');
    const candidatCNI = searchParams.get('numeroCNI'); // Récupération du numeroCNI du candidat

    const [validationError, setValidationError] = useState<string | null>(null);
    const [validationSuccess, setValidationSuccess] = useState<boolean>(false);
    const [codeParrainage, setCodeParrainage] = useState('');
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorTimer, setShowErrorTimer] = useState<NodeJS.Timeout | null>(null);

    // États pour stocker les informations saisies par l'utilisateur
    const [numeroElecteur, setNumeroElecteur] = useState<string>('');
    const [numeroCNI, setNumeroCNI] = useState<string>('');

    useEffect(() => {
        if (!candidatId || !nom || !prenom || !candidatCNI) {
            // Rediriger vers la page des candidats si les informations sont manquantes
            router.push('/interfaceElecteur/confirmeParrainage');
        }
    }, [candidatId, nom, prenom, candidatCNI, router]);

    useEffect(() => {
        if (validationSuccess) {
            const timer = setTimeout(() => {
                router.push('/interfaceElecteur/parrainage'); // Rediriger vers la page parrainage après 5 secondes
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [validationSuccess, router]);

    // Nettoyer le timer lors du démontage du composant
    useEffect(() => {
        return () => {
            if (showErrorTimer) {
                clearTimeout(showErrorTimer);
            }
        };
    }, [showErrorTimer]);

    // Fermer le menu mobile lorsque la fenêtre est redimensionnée
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const generateCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setCodeParrainage(code);
        setStep(2);
        setValidationError(null);
    };

    const handleSponsor = async () => {
        setIsLoading(true);
        try {
            if (!numeroElecteur || !numeroCNI || !candidatCNI) {
                throw new Error("Les informations de l'électeur ou du candidat sont manquantes.");
            }

            // Passer le numeroCNI du candidat à la fonction de parrainage
            const result = await sponsorCandidate(numeroElecteur, numeroCNI, candidatCNI);

            if (result.success) {
                setValidationSuccess(true);
                setValidationError(null);
                setStep(3); // Étape de succès
            } else {
                setValidationError(result.error ?? "Erreur inconnue lors du parrainage");
                const timer = setTimeout(() => {
                    window.location.reload();
                }, 5000);
                setShowErrorTimer(timer);
            }
        } catch (error: any) {
            setValidationError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000);
            setShowErrorTimer(timer);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = () => {
        setIsLoading(true);
        console.log("Vérification du code OTP...");
        console.log("Code saisi:", verificationCode);
        console.log("Code attendu:", codeParrainage);

        try {
            if (verificationCode === codeParrainage) {
                console.log("Vérification OTP réussie");
                handleSponsor();
            } else {
                console.log("Échec de la vérification OTP");
                setValidationError("Code de vérification invalide. Veuillez réessayer dans quelques instants.");
                setIsLoading(false);

                const timer = setTimeout(() => {
                    window.location.reload();
                }, 5000);
                setShowErrorTimer(timer);
            }
        } catch (error: any) {
            console.error("Erreur lors de la vérification:", error);
            setValidationError("Une erreur s'est produite lors de la vérification. Veuillez réessayer.");
            setIsLoading(false);

            const timer = setTimeout(() => {
                window.location.reload();
            }, 5000);
            setShowErrorTimer(timer);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-emerald-600">
            {/* Responsive Header */}
            <header className="bg-green-600 fixed top-0 left-0 right-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-4">
                            <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Accueil
                            </Link>
                            <Link href="/interfaceCandidat/login" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Candidats
                            </Link>
                            <Link href="/verification" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                                Vérification
                            </Link>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                className="text-white hover:bg-green-500 p-2 rounded-md"
                                onClick={toggleMenu}
                                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-green-600 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg transition-all duration-300">
                            <Link 
                                href="/" 
                                className="text-white hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link 
                                href="/interfaceCandidat/login" 
                                className="text-white hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Candidats
                            </Link>
                            <Link 
                                href="/verification" 
                                className="text-white hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Vérification
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            {/* Main content */}
            <div className="flex items-center justify-center min-h-screen p-4 pt-24">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-300/30 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl"></div>

                    <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8">
                        <h2 className="text-3xl font-bold text-white text-center">
                            Valider le parrainage
                        </h2>
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                    </div>

                    <div className="relative px-8 py-8">
                        {validationError && (
                            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                {validationError}
                            </div>
                        )}

                        {step === 1 && (
                            <>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                    <p className="text-center mb-2">Vous avez choisi de parrainer :</p>
                                    <div className="flex items-center justify-center flex-col">
                                        <div className="w-16 h-16 rounded-full mb-2 border-2 border-green-500 flex items-center justify-center bg-green-100">
                                            <span className="text-green-700 text-xl font-bold">{prenom?.charAt(0)}{nom?.charAt(0)}</span>
                                        </div>
                                        <h3 className="font-semibold">{prenom} {nom}</h3>
                                    </div>
                                </div>

                                <p className="mb-6 text-gray-700">Souhaitez-vous continuer avec le parrainage de ce candidat ? Vous recevrez un code de vérification.</p>

                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => router.push('/interfaceElecteur/confirmeParrainage')}
                                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={generateCode}
                                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Continuer
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-green-800 mb-4">Vérification</h2>

                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                                    <p className="text-center mb-2">Vous avez choisi de parrainer :</p>
                                    <div className="flex items-center justify-center flex-col">
                                        <div className="w-16 h-16 rounded-full mb-2 border-2 border-green-500 flex items-center justify-center bg-green-100">
                                            <span className="text-green-700 text-xl font-bold">{prenom?.charAt(0)}{nom?.charAt(0)}</span>
                                        </div>
                                        <h3 className="font-semibold">{prenom} {nom}</h3>
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <p className="text-gray-600">Un code à usage unique a été envoyé à votre adresse email et par SMS.</p>
                                    <p className="text-green-800 font-medium mt-2">(Simulé) Votre code est : {codeParrainage}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="numeroElecteur">
                                        Numéro d'électeur
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            id="numeroElecteur"
                                            value={numeroElecteur}
                                            onChange={(e) => setNumeroElecteur(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                                            placeholder="Numéro d'électeur"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="numeroCNI">
                                        Numéro CNI
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            id="numeroCNI"
                                            value={numeroCNI}
                                            onChange={(e) => setNumeroCNI(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                                            placeholder="Numéro CNI"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-gray-700 font-medium mb-2" htmlFor="verificationCode">
                                        Code à usage unique
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            id="verificationCode"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                                            placeholder=""
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={verifyOTP}
                                    disabled={isLoading || !!showErrorTimer}
                                    className="w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                                      bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200"
                                >
                                    {isLoading ? "Vérification en cours..." : showErrorTimer ? "Rechargement..." : "Vérifier"}
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 text-center">
                                <div className="bg-green-50 text-green-700 px-4 py-6 rounded-xl border border-green-100 flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <h3 className="text-lg font-semibold">Parrainage réussi !</h3>
                                    <p className="mt-2">Votre parrainage pour {prenom} {nom} a été enregistré.</p>
                                </div>

                                <p className="text-gray-600">Vous allez être redirigé vers la page de parrainage dans quelques secondes...</p>

                                <button
                                    onClick={() => router.push('/interfaceElecteur/parrainage')}
                                    className="w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                                      bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200"
                                >
                                    Aller à la page de parrainage
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}