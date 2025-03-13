"use client";

import { useState, useEffect } from 'react';
import { AgentLoginData } from '../../types/agent';
import { loginAgent } from '../../api/agents/login';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storeAuthData } from '../../types/agent';

import {
  User,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function LoginAgent() {
  const router = useRouter();
  const [formData, setFormData] = useState<AgentLoginData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginAgent(formData);

      if (result.success) {
        // Stocker le token et l'ID de l'agent
        storeAuthData(result.token as string, result.agentId as string);
        router.push('/interfaceAgent/dashboard'); 
      } else {
        setError(result.error || "Une erreur s'est produite");
        setErrorCountdown(5);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite");
      setErrorCountdown(5);
    } finally {
      setIsLoading(false);
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
            Connexion Agent
          </h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
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
                  Connexion...
                </span>
              ) : (
                <>
                  Connexion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              <span className="text-gray-700">Vous n'avez pas de compte? </span>
              <Link href="/interfaceAgent/register" className="text-green-600 hover:text-green-800 font-medium">
                Inscrivez-vous ici
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


