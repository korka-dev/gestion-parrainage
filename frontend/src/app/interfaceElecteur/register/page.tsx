"use client"
import { useState, useEffect } from 'react';
import { ElecteurData } from '../../types/electeur';
import { registerElecteur } from '../../api/electeurs/register';
import { useRouter } from 'next/navigation';
import { sendOTP } from '../../api/sms/sms';
import Link from 'next/link';

export default function RegisterElecteur() {
  const router = useRouter();
  const [formData, setFormData] = useState<ElecteurData>({
    electoralCard: '',
    nationalId: '',
    lastName: '',
    pollingStation: '',
    phone: '',
    email: '',
    code: '',
    photo: ''
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

  const checkExistingElecteur = async () => {
    setIsCheckingData(true);
    setError('');

    try {
      const result = await registerElecteur({...formData, checkOnly: true});

      if (!result.success && result.error && result.error.includes("L'électeur existe déjà")) {
        setError(result.error);
        setErrorCountdown(5);
        return false;
      }
      return true;
    } catch (err: any) {
      if (err.message && err.message.includes("L'électeur existe déjà")) {
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
    if (!formData.electoralCard || !formData.nationalId || !formData.lastName || !formData.pollingStation) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }

    const canProceed = await checkExistingElecteur();
    if (canProceed) {
      setError('');
      setStep(2);
    }
  };

  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.phone || !formData.email) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }
    setError('');
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, code: verificationCode });

    try {
      const result = await sendOTP(formData.phone, verificationCode);
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
      const result = await registerElecteur(formData);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Une erreur s'est produite");

        if (result.error && result.error.includes("L'électeur existe déjà")) {
          setErrorCountdown(5);
        }
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite");

      if (err.message && err.message.includes("L'électeur existe déjà")) {
        setErrorCountdown(5);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      electoralCard: '',
      nationalId: '',
      lastName: '',
      pollingStation: '',
      phone: '',
      email: '',
      code: '',
      photo: ''
    });
    setStep(1);
    setError('');
    setErrorCountdown(null);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 rounded shadow-md">
        <h2 className="text-xl font-bold text-green-600 mb-4">Inscription réussie!</h2>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter pour enregistrer votre parrainage.</p>
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
      <h1 className="text-2xl font-bold text-center mb-6">Système de Parrainage Électoral</h1>

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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
            disabled={isCheckingData}
          >
            {isCheckingData ? "Vérification..." : "Continuer"}
          </button>
          
          <div className="text-center mt-2">
            <span className="text-gray-700">Vous avez déjà un profil? </span>
            <Link href="/interfaceElecteur/login" className="text-green-600 hover:text-green-800">
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
            <Link href="/interfaceElecteur/login" className="text-green-600 hover:text-green-800">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitFinal}>
          <h2 className="text-xl font-semibold mb-4">Vérification</h2>

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
            <Link href="/interfaceElecteur/login" className="text-green-600 hover:text-green-800">
              Connectez-vous ici
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}