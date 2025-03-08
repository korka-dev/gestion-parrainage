"use client"

import { useState, useEffect } from 'react';
import { CandidatData } from '../../types/candidat';
import { registerCandidat } from '../../api/candidats/register';
import { useRouter } from 'next/navigation';
import { sendOTP } from '../../api/sms/sms';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { 
  User, 
  CreditCard, 
  Users, 
  Briefcase, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Palette, 
  FileText 
} from 'lucide-react';

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
    const newProgramme = [...formData.programme];
    newProgramme[index] = value;
    setFormData({ ...formData, programme: newProgramme });
  };

  const addProgramme = () => {
    setFormData({ ...formData, programme: [...formData.programme, ''] });
  };

  const handleCouleurChange = (index: number, value: string) => {
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

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Informations d'authentification";
      case 2: return "Informations de contact";
      case 3: return "Informations supplémentaires";
      default: return "Inscription Candidat";
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
              Inscription réussie
            </h2>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
          </div>
          
          <div className="relative px-8 py-8">
            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Votre compte a été créé avec succès.
            </div>
            
            <button
              onClick={() => router.push('/interfaceCandidat/login')}
              className="w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200 flex items-center justify-center"
            >
              Aller à la connexion
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
        {/* Éléments décoratifs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-300/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl"></div>
        
        {/* En-tête */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Inscription
          </h2>
          <p className="text-green-50 text-center mt-2">
            {getStepTitle()}
          </p>
          
          {/* Indicateur d'étape */}
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step ? 'bg-white' : 'bg-green-200/50'
                }`}
              ></div>
            ))}
          </div>
          
          {/* Élément décoratif */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
        </div>

        {/* Contenu du formulaire */}
        <div className="relative px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {error}
            </div>
          )}
          
          {step === 1 && (
            <form onSubmit={handleSubmitAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="numeroElecteur" className="block text-sm font-medium text-gray-700">
                  Numéro de carte d'électeur
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="numeroElecteur"
                    name="numeroElecteur"
                    type="text"
                    value={formData.numeroElecteur}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="numeroCNI" className="block text-sm font-medium text-gray-700">
                  Numéro de carte d'identité nationale
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="numeroCNI"
                    name="numeroCNI"
                    type="text"
                    value={formData.numeroCNI}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="parti" className="block text-sm font-medium text-gray-700">
                  Parti politique
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="parti"
                    name="parti"
                    type="text"
                    value={formData.parti}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                  ${isCheckingData 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200'
                  }`}
                disabled={isCheckingData}
              >
                {isCheckingData ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center mt-4 text-sm text-gray-600">
                <span className="text-gray-700">Vous avez déjà un profil? </span>
                <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800 font-medium">
                  Connectez-vous ici
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    placeholder="Ex: 771234567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 px-4 rounded-xl font-medium transition duration-200 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Retour
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200"
                >
                  Recevoir code
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                <span className="text-gray-700">Vous avez déjà un profil? </span>
                <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800 font-medium">
                  Connectez-vous ici
                </Link>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitFinal} className="space-y-4">
              <div className="mb-6 bg-green-50 text-green-800 px-4 py-3 rounded-xl border border-green-100 text-sm">
                <p>Un code de vérification a été envoyé à votre numéro de téléphone et email.</p>
                <p className="font-bold mt-1">Code de test: {formData.code}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  Code de vérification
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  </div>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    disabled
                    value={formData.code}
                    className="block w-full pl-10 pr-3 py-3 text-center tracking-widest border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="programme" className="block text-sm font-medium text-gray-700">
                  Programmes du candidat
                </label>
                {formData.programme.map((programme, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={programme}
                      onChange={(e) => handleProgrammeChange(index, e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                      placeholder="Entrez un programme"
                      required
                    />
                    {index === formData.programme.length - 1 && (
                      <div 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-green-500 hover:text-green-700"
                        onClick={addProgramme}
                      >
                        <FaPlus className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="couleurs" className="block text-sm font-medium text-gray-700">
                  Couleurs du parti (max 3)
                </label>
                {formData.couleurs.map((couleur, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Palette className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={couleur}
                        onChange={(e) => handleCouleurChange(index, e.target.value)}
                        className="w-10 h-10 rounded-lg ml-10 mr-2 border border-gray-200"
                      />
                      <span className="text-gray-600 text-sm">{couleur}</span>
                    </div>
                    {index === formData.couleurs.length - 1 && formData.couleurs.length < 3 && (
                      <div 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-green-500 hover:text-green-700"
                        onClick={addCouleur}
                      >
                        <FaPlus className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-4 px-4 rounded-xl font-medium transition duration-200 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Retour
                </button>

                <button
                  type="submit"
                  className={`w-2/3 py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
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
                      Traitement...
                    </span>
                  ) : (
                    <>
                      Confirmer l'inscription
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                <span className="text-gray-700">Vous avez déjà un profil? </span>
                <Link href="/interfaceCandidat/login" className="text-green-600 hover:text-green-800 font-medium">
                  Connectez-vous ici
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}