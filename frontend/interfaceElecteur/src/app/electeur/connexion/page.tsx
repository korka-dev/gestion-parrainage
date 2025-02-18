'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VoterLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    voterCardNumber: '',
    nationalId: '',
    lastName: '',
    pollingStation: '',
  });
  const [error, setError] = useState('');

  // Gestion des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion de la soumission avec vérification locale
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification locale simulée
    if (
      formData.voterCardNumber === '12345' &&
      formData.nationalId === 'ABC123' &&
      formData.lastName === 'Doe' &&
      formData.pollingStation === '001'
    ) {
      // Redirection en cas de réussite
      router.push('/electeur/contact');
    } else {
      // Affichage d'une erreur en cas d'échec
      setError('Les informations fournies sont incorrectes');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-green-500 via-green-600 to-green-700 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/images/background-voting.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-green-200">
          <div className="bg-green-50 p-4 rounded-md mb-6 text-green-700 border border-green-100">
            <p>
              Bienvenue sur votre espace Électeur ! Veuillez fournir vos informations pour valider votre
              parrainage.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="voterCardNumber" className="block text-sm font-medium text-green-700">
                Numéro de carte d&apos;électeur
              </label>
              <div className="relative mt-1">
                <input
                  id="voterCardNumber"
                  name="voterCardNumber"
                  type="text"
                  required
                  value={formData.voterCardNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-green-300 rounded-md shadow-sm placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10a8 8 0 1116 0A8 8 0 012 10z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-green-700">
                Numéro de carte d&apos;identité nationale
              </label>
              <div className="relative mt-1">
                <input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  required
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-green-300 rounded-md shadow-sm placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm10 3H7v2h6V7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-green-700">
                Nom de famille
              </label>
              <div className="relative mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-green-300 rounded-md shadow-sm placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3.5 8h13a1 1 0 011 1v3a1 1 0 01-1 1h-13a1 1 0 01-1-1V9a1 1 0 011-1z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="pollingStation" className="block text-sm font-medium text-green-700">
                Numéro du bureau de vote
              </label>
              <div className="relative mt-1">
                <input
                  id="pollingStation"
                  name="pollingStation"
                  type="text"
                  required
                  value={formData.pollingStation}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-green-300 rounded-md shadow-sm placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4.5 9.5h11v1h-11v-1z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}