'use client';

import { ChangeEvent, useState } from 'react';
import { Mail } from 'lucide-react';

interface FormData {
  email: string;
  code: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

    // try {
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   console.log('Connexion réussie !');
    // } catch (err) {
    //   setError('Erreur lors de la connexion. Veuillez réessayer.');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* En-tête */}
        <div className="bg-green-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Connexion
          </h2>
          <p className="text-green-100 text-center mt-2">
            Accédez à votre espace parrainage
          </p>
        </div>

        {/* Formulaire */}
        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                  placeholder="votreemail@exemple.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Code d&apos;authentification
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-center tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 text-lg"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-150
                ${loading 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
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
              ) : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;