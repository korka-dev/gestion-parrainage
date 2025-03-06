'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getElecteurInfo } from '../../api/electeurs/getInfo';
import { loginElecteur } from '../../api/electeurs/login';
import Link from 'next/link';

export default function LoginElecteur() {
  const [step, setStep] = useState(1);
  const [electoralCard, setElectoralCard] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [userData, setUserData] = useState<{
    nom: string;
    bureauVote: string;
    telephone: string;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (error) {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }, [error]);

  
  const fetchElecteurDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getElecteurInfo(electoralCard);

      if (response.success) {
        setUserData(response.data || null);
        setStep(2);
      } else {
        setError(response.error || "Erreur lors de la récupération des détails de l'électeur");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des détails de l'électeur");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAuthCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await loginElecteur({ electoralCard, code: authCode });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Erreur lors de la vérification du code OTP");
      }
    } catch (err) {
      setError("Erreur lors de la vérification du code OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold text-green-600 mb-4">Connexion réussie!</h2>
        <p>Vous êtes maintenant connecté.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Terminer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Head>
        <title>Enregistrement de Parrainage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">SenParrainage Électoral</h1>
            <div className="h-1 w-32 bg-green-600 mx-auto"></div>
          </header>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Étape 1: Saisie des informations d'identification */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Identification Électeur</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="electoralCard">
                    Numéro de carte d'électeur
                  </label>
                  <input
                    type="text"
                    id="electoralCard"
                    value={electoralCard}
                    onChange={(e) => setElectoralCard(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Entrez votre numéro de carte d'électeur"
                  />
                </div>
              </div>
              <button
                onClick={fetchElecteurDetails}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 mb-4"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Vérifier"}
              </button>
              
              <div className="text-center mt-2">
                <span className="text-gray-700">Vous n'avez pas encore de profil? </span>
                <Link href="/interfaceElecteur/register" className="text-green-600 hover:text-green-800">
                  Créez-en un ici
                </Link>
              </div>
            </div>
          )}

          {/* Étape 2: Affichage des informations de l'électeur */}
          {step === 2 && userData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Détails de l'Électeur</h2>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">Vos informations</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="font-medium">{userData.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bureau de vote</p>
                    <p className="font-medium">{userData.bureauVote}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{userData.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="authCode">
                  Code d'Authentification
                </label>
                <input
                  type="text"
                  id="authCode"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Entrez votre code d'authentification"
                />
              </div>
              <button
                onClick={verifyAuthCode}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 mb-4"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Continuer"}
              </button>
              
              <div className="text-center mt-2">
                <span className="text-gray-700">Vous n'avez pas encore de profil? </span>
                <Link href="/interfaceElecteur/register" className="text-green-600 hover:text-green-800">
                  Créez-en un ici
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-8 mb-4 text-center text-gray-600 text-sm">
        <p>© 2025 SenParrainage Électoral</p>
      </footer>
    </div>
  );
}