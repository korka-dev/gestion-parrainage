'use client';

import { useState } from 'react';

export default function ParrainageForm() {
  const [electorNumber, setElectorNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [voterInfo, setVoterInfo] = useState(null);
  const [error, setError] = useState('');
  const [authCode, setAuthCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simuler une vérification des informations
    if (electorNumber && nationalId) {
      // Ici, vous feriez une requête à votre API pour vérifier les informations
      // Pour l'exemple, nous simulons une réponse réussie
      setVoterInfo({
        name: 'Dupont',
        firstName: 'Jean',
        birthDate: '01/01/1980',
        pollingStation: 'Bureau de vote 123'
      });
      setError('');
    } else {
      setError('Veuillez vérifier les informations saisies.');
    }
  };

  const handleAuthCodeSubmit = () => {
    // Traiter la soumission du code d'authentification
    alert(`Code d'authentification soumis : ${authCode}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="electorNumber" className="block text-sm font-medium text-gray-700">Numéro de carte d'électeur</label>
          <input
            type="text"
            id="electorNumber"
            value={electorNumber}
            onChange={(e) => setElectorNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">Numéro de carte d'identité nationale</label>
          <input
            type="text"
            id="nationalId"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Vérifier les informations
        </button>
      </form>

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      {voterInfo && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Informations de l'électeur</h3>
          <div className="mt-2 space-y-2 text-green-700">
            <p><span className="font-semibold">Nom :</span> {voterInfo.name}</p>
            <p><span className="font-semibold">Prénom :</span> {voterInfo.firstName}</p>
            <p><span className="font-semibold">Date de naissance :</span> {voterInfo.birthDate}</p>
            <p><span className="font-semibold">Bureau de vote :</span> {voterInfo.pollingStation}</p>
          </div>
          <div className="mt-4">
            <label htmlFor="authCode" className="block text-sm font-medium text-gray-700">Code d'authentification</label>
            <input
              type="text"
              id="authCode"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <button
            onClick={handleAuthCodeSubmit}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Se Connecter
          </button>
        </div>
      )}
    </div>
  );
}