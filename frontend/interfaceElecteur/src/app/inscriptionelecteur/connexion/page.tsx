// pages/inscription.js
'use client';
import { useState } from 'react';

export default function FormulaireParrainage() {
  const [formData, setFormData] = useState({
    electoralCard: '',
    nationalId: '',
    lastName: '',
    pollingStation: '',
    phone: '',
    email: '',
    code: ''
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitAuth = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.electoralCard || !formData.nationalId || !formData.lastName || !formData.pollingStation) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    // Simple validation for step 2
    if (!formData.phone || !formData.email) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }
    setError('');
    
    // Generate a verification code (in a real application, this would be sent via SMS/email)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, code: verificationCode });
    
    // In a real app, you would send the code to the user here
    console.log("Code généré:", verificationCode);
    
    setStep(3);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/register-voter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Une erreur s'est produite");
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold text-green-600 mb-4">Inscription réussie!</h2>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter pour enregistrer votre parrainage.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Système de Parrainage Électoral</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {step === 1 && (
        <form onSubmit={handleSubmitAuth}>
          <h2 className="text-xl font-semibold mb-4">Informations d'authentification</h2>
          
          <div className="mb-4">
            <label className="block mb-1">Numéro de carte d'électeur</label>
            <input
              type="text"
              name="electoralCard"
              value={formData.electoralCard}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Numéro de carte d'identité nationale</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Nom de famille</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Numéro de bureau de vote</label>
            <input
              type="text"
              name="pollingStation"
              value={formData.pollingStation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continuer
          </button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleSubmitContact}>
          <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>
          
          <div className="mb-4">
            <label className="block mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: 771234567"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Adresse email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Retour
            </button>
            
            <button
              type="submit"
              className="w-2/3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Recevoir code
            </button>
          </div>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={handleSubmitFinal}>
          <h2 className="text-xl font-semibold mb-4">Vérification</h2>
          
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
            <p>Un code de vérification a été envoyé à votre numéro de téléphone et email.</p>
            <p className="font-bold">Code de test: {formData.code}</p>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Entrez le code reçu</label>
            <input
              type="text"
              name="verificationCode"
              className="w-full p-2 border rounded"
              placeholder="Code à 6 chiffres"
              disabled
              value={formData.code}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
              disabled={isLoading}
            >
              Retour
            </button>
            
            <button
              type="submit"
              className="w-2/3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Traitement..." : "Confirmer l'inscription"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}