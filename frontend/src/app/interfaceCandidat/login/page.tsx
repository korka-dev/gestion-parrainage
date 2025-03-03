'use client';

import { ChangeEvent, useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginCandidat } from '../../api/candidats/login';

interface FormData {
  email: string;
  code: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'code') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }

    if (formData.code.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      setLoading(false);
      return;
    }

    try {
      const result = await loginCandidat(formData);
      
      if (!result.success) {
        setError(result.error || 'Erreur lors de la connexion');
      } else {
        if (result.token) {
          localStorage.setItem('token', result.token);
          setSuccessMessage(result.message || 'Connexion réussie');
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          setError('Erreur: Token manquant');
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-emerald-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Éléments décoratifs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-300/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl"></div>
        
        {/* En-tête */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Connexion
          </h2>
          <p className="text-green-50 text-center mt-2">
            Accédez à votre espace parrainage
          </p>
          
          {/* Élément décoratif */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400"></div>
        </div>

        {/* Formulaire */}
        <div className="relative px-8 py-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="votreemail@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Code d&apos;authentification
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 text-center tracking-widest border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm text-lg"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-xl text-white font-medium transition duration-200 flex items-center justify-center
                ${loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-green-200'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};