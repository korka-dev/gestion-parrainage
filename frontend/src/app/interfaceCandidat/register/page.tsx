"use client"

import { useState, useEffect } from 'react';
import { CandidatData } from '../../types/candidat';
import { registerCandidat } from '../../api/candidats/register';
import { useRouter } from 'next/navigation';
import { sendOTP } from '../../api/sms/sms';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa'; 

export default function RegisterCandidat() {
  const router = useRouter();
  const [formData, setFormData] = useState<CandidatData>({
    numeroElecteur: '',
    numeroCNI: '',
    nom: '',
    prenom: '',
    parti: '',
    telephone: '',
    email: '',
    code: '',
    photoId:'',
    programme: [''], 
    couleurs: ['']   
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCheckingData, setIsCheckingData] = useState(false);
  const [errorCountdown, setErrorCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (errorCountdown !== null && errorCountdown > 0) {
      const timer = setTimeout(() => {
        setErrorCountdown(errorCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (errorCountdown === 0) {
      window.location.reload();
    }
  }, [errorCountdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProgrammeChange = (index: number, value: string) => {
    // Create a copy of the programme array
    const newProgramme = [...formData.programme];
    newProgramme[index] = value;
    setFormData({ ...formData, programme: newProgramme });
  };

  const addProgramme = () => {
    setFormData({ ...formData, programme: [...formData.programme, ''] });
  };

  const handleCouleurChange = (index: number, value: string) => {
    // Create a copy of the couleurs array
    const newCouleurs = [...formData.couleurs];
    newCouleurs[index] = value;
    setFormData({ ...formData, couleurs: newCouleurs });
  };

  const addCouleur = () => {
    if (formData.couleurs.length < 3) {
      setFormData({ ...formData, couleurs: [...formData.couleurs, '#ffffff'] });
    }
  };

  const checkExistingCandidat = async () => {
    setIsCheckingData(true);
    setError('');

    try {
      const result = await registerCandidat({ ...formData, checkOnly: true });

      if (!result.success && result.error && result.error.includes("Le candidat existe déjà")) {
        setError(result.error);
        setErrorCountdown(5);
        return false;
      }
      return true;
    } catch (err: any) {
      if (err.message && err.message.includes("Le candidat existe déjà")) {
        setError(err.message);
        setErrorCountdown(5);
        return false;
      }
      return true;
    } finally {
      setIsCheckingData(false);
    }
  };

  const handleSubmitAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.numeroElecteur || !formData.numeroCNI || !formData.nom || !formData.prenom || !formData.parti) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }

    const canProceed = await checkExistingCandidat();
    if (canProceed) {
      setError('');
      setStep(2);
    }
  };

  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.telephone || !formData.email) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }
    setError('');
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, code: verificationCode });

    try {
      const result = await sendOTP(formData.telephone, verificationCode);
      if (!result.success) {
        setError(result.error as string);
        return;
      }

      console.log("Code généré:", verificationCode);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite");
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await registerCandidat(formData);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Une erreur s'est produite");

        if (result.error && result.error.includes("Le candidat existe déjà")) {
          setErrorCountdown(5);
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite");

      if (err.message && err.message.includes("Le candidat existe déjà")) {
        setErrorCountdown(5);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      numeroElecteur: '',
      numeroCNI: '',
      nom: '',
      prenom: '',
      parti: '',
      telephone: '',
      email: '',
      code: '',
      photoId:"",
      programme: [''],
      couleurs: ['']
    });
    setStep(1);
    setError('');
    setErrorCountdown(null);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 rounded shadow-md">
        <h2 className="text-xl font-bold text-green-600 mb-4">Inscription réussie!</h2>
        <p>Votre compte a été créé avec succès.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Aller à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Système de Candidature Électorale</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmitAuth}>
          <h2 className="text-xl font-semibold mb-4">Informations d'authentification</h2>

          <div className="mb-4">
            <label className="block mb-1">Numéro de carte d'électeur</label>
            <input
              type="text"
              name="numeroElecteur"
              value={formData.numeroElecteur}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Numéro de carte d'identité nationale</label>
            <input
              type="text"
              name="numeroCNI"
              value={formData.numeroCNI}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Parti politique</label>
            <input
              type="text"
              name="parti"
              value={formData.parti}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
            disabled={isCheckingData}
          >
            {isCheckingData ? "Vérification..." : "Continuer"}
          </button>

          <div className="text-center mt-2">
            <span className="text-gray-700">Vous avez déjà un profil? </span>
            <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitContact}>
          <h2 className="text-xl font-semibold mb-4">Informations de contact</h2>

          <div className="mb-4">
            <label className="block mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
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

          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Retour
            </button>

            <button
              type="submit"
              className="w-2/3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Recevoir code
            </button>
          </div>

          <div className="text-center mt-2">
            <span className="text-gray-700">Vous avez déjà un profil? </span>
            <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitFinal}>
          <h2 className="text-xl font-semibold mb-4">Informations supplémentaires</h2>

          <div className="mb-4">
            <label className="block mb-1">Programmes du candidat</label>
            {formData.programme.length > 0 ? (
              formData.programme.map((programme, index) => (
                <div key={index} className="mb-2 relative">
                  <input
                    type="text"
                    value={programme}
                    onChange={(e) => handleProgrammeChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {index === formData.programme.length - 1 && (
                    <FaPlus
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={addProgramme}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="mb-2">
                <label className="block mb-1">Aucun programme ajouté</label>
                <FaPlus
                  className="text-gray-500 cursor-pointer"
                  onClick={addProgramme}
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Couleurs du parti</label>
            {formData.couleurs.length > 0 ? (
              formData.couleurs.map((couleur, index) => (
                <div key={index} className="mb-2 relative">
                  <input
                    type="color"
                    value={couleur}
                    onChange={(e) => handleCouleurChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  {index === formData.couleurs.length - 1 && formData.couleurs.length < 3 && (
                    <FaPlus
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={addCouleur}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="mb-2">
                <label className="block mb-1">Aucune couleur ajoutée</label>
                <FaPlus
                  className="text-gray-500 cursor-pointer"
                  onClick={addCouleur}
                />
              </div>
            )}
          </div>

          <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">
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

          <div className="flex space-x-2 mb-4">
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
              className="w-2/3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Traitement..." : "Confirmer l'inscription"}
            </button>
          </div>

          <div className="text-center mt-2">
            <span className="text-gray-700">Vous avez déjà un profil? </span>
            <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
