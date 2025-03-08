'use client'
import { useState, useEffect } from 'react';
import { getElecteurInfo } from '../../api/electeurs/getInfo';
import { loginElecteur } from '../../api/electeurs/login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, User, Lock, ArrowRight } from 'lucide-react';

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

  const router = useRouter();

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
        router.push("/interfaceElecteur/parrainage")
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-emerald-600 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-300/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl"></div>

          <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Connexion réussie
            </h2>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
          </div>

          <div className="relative px-8 py-8">
            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Vous êtes maintenant connecté.
            </div>

            <button
              onClick={() => router.push('/interfaceElecteur/parrainage')}
              className="w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200 flex items-center justify-center"
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-emerald-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-300/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl"></div>

        <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Connexion
          </h2>
          <p className="text-green-50 text-center mt-2">
            {step === 1 ? "Identification Électeur" : "Vérification"}
          </p>

          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step ? 'bg-white' : 'bg-green-200/50'
                }`}
              ></div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
        </div>

        <div className="relative px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="electoralCard" className="block text-sm font-medium text-gray-700">
                  Numéro de carte d'électeur
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="electoralCard"
                    value={electoralCard}
                    onChange={(e) => setElectoralCard(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    placeholder="Entrez votre numéro de carte d'électeur"
                  />
                </div>
              </div>

              <button
                onClick={fetchElecteurDetails}
                className={`w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                  ${isLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  <>
                    Vérifier
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4 text-sm text-gray-600">
                <span className="text-gray-700">Vous n'avez pas encore de profil? </span>
                <Link href="/interfaceElecteur/register" className="text-green-600 hover:text-green-800 font-medium">
                  Créez-en un ici
                </Link>
              </div>
            </div>
          )}

          {step === 2 && userData && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
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

              <div className="space-y-2">
                <label htmlFor="authCode" className="block text-sm font-medium text-gray-700">
                  Code d'Authentification
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="authCode"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    placeholder="Entrez votre code d'authentification"
                  />
                </div>
              </div>

              <button
                onClick={verifyAuthCode}
                className={`w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                  ${isLoading
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  <>
                    Confirmer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4 text-sm text-gray-600">
                <span className="text-gray-700">Vous n'avez pas encore de profil? </span>
                <Link href="/interfaceElecteur/register" className="text-green-600 hover:text-green-800 font-medium">
                  Créez-en un ici
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}