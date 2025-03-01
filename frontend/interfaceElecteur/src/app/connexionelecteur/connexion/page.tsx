'use client'
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [step, setStep] = useState(1);
  const [electoralCard, setElectoralCard] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userData, setUserData] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  // Données factices des candidats pour la démonstration
  const candidates = [
    { id: 1, name: 'Jean Dupont', slogan: 'Ensemble pour l\'avenir', photo: '/api/placeholder/150/150', color: 'emerald-600' },
    { id: 2, name: 'Marie Martin', slogan: 'La force du changement', photo: '/api/placeholder/150/150', color: 'green-700' },
    { id: 3, name: 'Paul Lefebvre', slogan: 'Un nouveau départ', photo: '/api/placeholder/150/150', color: 'lime-600' },
    { id: 4, name: 'Sophie Morel', slogan: 'Pour une nation unie', photo: '/api/placeholder/150/150', color: 'teal-600' },
  ];

  const verifyUserIdentity = () => {
    // Simulation d'une vérification réussie
    if (electoralCard && nationalId) {
      setUserData({
        firstName: 'Ahmed',
        lastName: 'Diop',
        birthDate: '15/05/1985',
        pollingStation: 'Centre Ville - Bureau 12'
      });
      setStep(2);
    }
  };

  const verifyAuthCode = () => {
    // Simulation de vérification du code d'authentification
    if (authCode) {
      setStep(3);
    }
  };

  const selectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    // Génération d'un code à 5 chiffres
    setVerificationCode(Math.floor(10000 + Math.random() * 90000).toString());
    setStep(4);
  };

  const verifyOTP = () => {
    // Vérification du code à usage unique
    if (verificationCode) {
      setStep(5);
    }
  };

  const confirmParrainage = () => {
    // Confirmation finale et génération du code de confirmation
    setConfirmationCode(Math.random().toString(36).substring(2, 10).toUpperCase());
    setIsSubmitted(true);
    setStep(6);
  };

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

          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold 
                  ${step >= stepNumber ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-600 rounded-full transition-all duration-500" 
                style={{ width: `${(step - 1) * 20}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Étape 1: Saisie des informations d'identification */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Identification Électeur</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="electoralCard">
                      Numéro de Carte d'Électeur
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
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="nationalId">
                      Numéro de Carte d'Identité Nationale
                    </label>
                    <input
                      type="text"
                      id="nationalId"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="Entrez votre numéro de carte d'identité"
                    />
                  </div>
                </div>
                <button
                  onClick={verifyUserIdentity}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                >
                  Vérifier
                </button>
              </div>
            )}

            {/* Étape 2: Affichage des informations et saisie du code d'authentification */}
            {step === 2 && userData && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Confirmation d'Identité</h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h3 className="font-semibold text-green-800 mb-2">Vos informations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Nom</p>
                      <p className="font-medium">{userData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prénom</p>
                      <p className="font-medium">{userData.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date de naissance</p>
                      <p className="font-medium">{userData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bureau de vote</p>
                      <p className="font-medium">{userData.pollingStation}</p>
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
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* Étape 3: Sélection du candidat */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Choisir un Candidat</h2>
                <p className="text-gray-600 mb-4">Veuillez sélectionner le candidat que vous souhaitez parrainer :</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => selectCandidate(candidate)}
                      className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md flex flex-col items-center text-center ${
                        selectedCandidate?.id === candidate.id ? `border-${candidate.color} bg-${candidate.color}/10` : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className={`w-24 h-24 rounded-full mb-3 border-2 border-${candidate.color}`}
                      />
                      <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
                      <p className="text-gray-600 italic text-sm">"{candidate.slogan}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 4: Saisie du code à usage unique */}
            {step === 4 && selectedCandidate && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Vérification</h2>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <p className="text-center mb-2">Vous avez choisi de parrainer :</p>
                  <div className="flex items-center justify-center flex-col">
                    <img
                      src={selectedCandidate.photo}
                      alt={selectedCandidate.name}
                      className={`w-16 h-16 rounded-full mb-2 border-2 border-${selectedCandidate.color}`}
                    />
                    <h3 className="font-semibold">{selectedCandidate.name}</h3>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-gray-600">Un code à 5 chiffres à usage unique a été envoyé à votre adresse email et par SMS.</p>
                  <p className="text-green-800 font-medium mt-2">(Simulé) Votre code est : {verificationCode}</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="verificationCode">
                    Code à usage unique
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    // maxLength="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-wider"
                    placeholder="X X X X X"
                  />
                </div>
                
                <button
                  onClick={verifyOTP}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                >
                  Vérifier
                </button>
              </div>
            )}

            {/* Étape 5: Confirmation finale */}
            {step === 5 && selectedCandidate && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">Confirmation</h2>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-4">
                  <div className="text-center mb-4">
                    <img
                      src={selectedCandidate.photo}
                      alt={selectedCandidate.name}
                      className={`w-24 h-24 rounded-full mx-auto mb-3 border-2 border-${selectedCandidate.color}`}
                    />
                    <h3 className="font-semibold text-lg">{selectedCandidate.name}</h3>
                    <p className="text-gray-600 italic">"{selectedCandidate.slogan}"</p>
                  </div>
                  
                  <div className="border-t border-green-200 pt-4 mt-4">
                    <p className="text-center text-gray-800 font-medium">
                      Vous êtes sur le point de confirmer votre parrainage pour ce candidat.
                    </p>
                    <p className="text-center text-gray-600 mt-2">
                      Cette action est définitive et ne pourra pas être modifiée ultérieurement.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(3)}
                    className="w-1/2 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg transition duration-300 hover:bg-gray-50"
                  >
                    Revenir en arrière
                  </button>
                  <button
                    onClick={confirmParrainage}
                    className="w-1/2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                  >
                    Confirmer mon parrainage
                  </button>
                </div>
              </div>
            )}

            {/* Étape 6: Confirmation avec succès */}
            {step === 6 && isSubmitted && (
              <div className="text-center space-y-6">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-green-800 mb-2">Parrainage Enregistré</h2>
                  <p className="text-gray-600">
                    Votre parrainage a été enregistré avec succès. Un message de confirmation a été envoyé à votre adresse email et par SMS.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-600 mb-2">Votre code de vérification est :</p>
                  <div className="bg-white py-3 px-4 rounded border border-green-200 font-mono text-xl tracking-wider">
                    {confirmationCode}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Conservez ce code. Il vous permettra de vérifier que votre choix n'a pas été modifié.
                  </p>
                </div>
                
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 inline-block"
                >
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-8 mb-4 text-center text-gray-600 text-sm">
        <p>© 2025 SenParrainage Électoral</p>
      </footer>
    </div>
  );
}