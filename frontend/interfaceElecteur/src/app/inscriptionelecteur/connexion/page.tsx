'use client'
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
  // États pour gérer les différentes étapes et données du formulaire
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    electoralCard: '',
    nationalId: '',
    lastName: '',
    pollingStation: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authCode, setAuthCode] = useState('');

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation de la première étape
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.electoralCard) {
      newErrors.electoralCard = 'Le numéro de carte d\'électeur est requis';
    }
    
    if (!formData.nationalId) {
      newErrors.nationalId = 'Le numéro de carte d\'identité est requis';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Le nom de famille est requis';
    }
    
    if (!formData.pollingStation) {
      newErrors.pollingStation = 'Le numéro du bureau de vote est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation de la seconde étape
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^\d{9,10}$/.test(formData.phone)) {
      newErrors.phone = 'Format de numéro de téléphone invalide';
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission de la première étape
  const submitStep1 = async () => {
    if (validateStep1()) {
      setIsLoading(true);
      
      // Simulation d'une vérification avec le serveur
      setTimeout(() => {
        // Simulation de réponse positive du serveur
        setIsLoading(false);
        setStep(2);
      }, 1500);
    }
  };

  // Soumission de la seconde étape
  const submitStep2 = async () => {
    if (validateStep2()) {
      setIsLoading(true);
      
      // Simulation d'une vérification avec le serveur
      setTimeout(() => {
        // Générer un code d'authentification à 6 chiffres
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        setAuthCode(generatedCode);
        
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Head>
        <title>Enregistrement du Profil de Parrain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              {step === 1 ? 'Création de Profil Parrain' : isSuccess ? 'Profil Créé avec Succès' : 'Informations de Contact'}
            </h1>
            <div className="h-1 w-32 bg-green-600 mx-auto"></div>
          </header>

          {/* Barre de progression */}
          <div className="mb-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-green-600 bg-green-200">
                  Étape {isSuccess ? 'Terminée' : step} / 2
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {isSuccess ? '100%' : step === 1 ? '50%' : '100%'}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                <div
                  style={{ width: isSuccess ? '100%' : step === 1 ? '50%' : '100%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Étape 1: Informations d'authentification */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Veuillez saisir vos informations d'authentification pour créer votre profil de parrain.
                </p>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="electoralCard">
                    Numéro de Carte d'Électeur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="electoralCard"
                    name="electoralCard"
                    value={formData.electoralCard}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.electoralCard ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: EL123456789"
                  />
                  {errors.electoralCard && (
                    <p className="mt-1 text-red-500 text-sm">{errors.electoralCard}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="nationalId">
                    Numéro de Carte d'Identité Nationale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nationalId"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.nationalId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 1234567890123"
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-red-500 text-sm">{errors.nationalId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                    Nom de Famille <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Diop"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="pollingStation">
                    Numéro du Bureau de Vote <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pollingStation"
                    name="pollingStation"
                    value={formData.pollingStation}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.pollingStation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 12"
                  />
                  {errors.pollingStation && (
                    <p className="mt-1 text-red-500 text-sm">{errors.pollingStation}</p>
                  )}
                </div>
                
                <button
                  onClick={submitStep1}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 ${
                    isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  } text-white font-medium rounded-lg transition duration-300 flex justify-center items-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Vérification...
                    </>
                  ) : (
                    'Vérifier mes informations'
                  )}
                </button>
              </div>
            )}

            {/* Étape 2: Informations de contact */}
            {step === 2 && !isSuccess && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Veuillez saisir vos informations de contact pour terminer la création de votre profil.
                </p>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Numéro de Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 770001122"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Adresse Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-green-500 focus:border-green-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: prenom.nom@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div className="flex space-x-4 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg transition duration-300 hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    onClick={submitStep2}
                    disabled={isLoading}
                    className={`w-2/3 py-3 px-4 ${
                      isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                    } text-white font-medium rounded-lg transition duration-300 flex justify-center items-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement...
                      </>
                    ) : (
                      'Créer mon profil'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Succès: Profil créé */}
            {isSuccess && (
              <div className="text-center space-y-6">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-green-800 mb-2">Profil Créé avec Succès!</h2>
                  <p className="text-gray-600">
                    Votre profil de parrain a été créé avec succès. Un code d'authentification a été envoyé à votre téléphone et à votre adresse email.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-600 mb-2">Votre code d'authentification est :</p>
                  <div className="bg-white py-3 px-4 rounded border border-green-200 font-mono text-xl tracking-wider">
                    {authCode}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Conservez ce code. Il vous sera demandé lors de l'enregistrement de votre parrainage.
                  </p>
                </div>
                
                <Link href="/parrainage" className="mt-6 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 inline-block">
                  Aller à la page de parrainage
                </Link>
              </div>
            )}
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p>Vous avez déjà un profil? <Link href="/login" className="text-green-700 hover:underline">Connectez-vous ici</Link></p>
          </div>
        </div>
      </main>

      <footer className="mt-8 mb-4 text-center text-gray-600 text-sm">
        <p>© 2025 Système National d'Enregistrement de Parrainage</p>
      </footer>
    </div>
  );
}