'use client'

import { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'

interface CandidateInfo {
  voterNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface CandidateForm {
  email: string;
  phone: string;
  party: string;
  slogan: string;
  photo: File | null;
  colors: string[];
  websiteUrl: string;
}

export default function CandidatesManagement() {
  const [voterNumber, setVoterNumber] = useState('')
  const [error, setError] = useState('')
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null)
  const [formData, setFormData] = useState<CandidateForm>({
    email: '',
    phone: '',
    party: '',
    slogan: '',
    photo: null,
    colors: ['#008000', '#006400', '#32CD32'],
    websiteUrl: ''
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await new Promise<CandidateInfo>((resolve) => 
        setTimeout(() => resolve({
          voterNumber,
          firstName: 'John',
          lastName: 'Doe',
          birthDate: '1980-01-01'
        }), 1000)
      )
      
      setCandidateInfo(response)
    } catch (error) {
      setError("Le candidat considéré n'est pas présent dans le fichier électoral")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Candidature enregistrée avec succès.')
    } catch (error) {
      alert('Erreur lors de l\'enregistrement')
    }
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = value
    setFormData({ ...formData, colors: newColors })
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-green-700 text-center mb-8">Enregistrement des Candidats</h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="mb-4">
              <label className="block text-lg font-semibold text-green-800 mb-2">
                Numéro de Carte d'Électeur
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={voterNumber}
                  onChange={(e) => setVoterNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-md flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {candidateInfo && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-green-100 p-4 rounded-md">
                <h3 className="font-semibold text-green-800">Informations de l'Électeur</h3>
                <p className="text-sm text-green-700">Nom: {candidateInfo.lastName}</p>
                <p className="text-sm text-green-700">Prénom: {candidateInfo.firstName}</p>
                <p className="text-sm text-green-700">Date de naissance: {candidateInfo.birthDate}</p>
              </div>

              <div className="space-y-4">
                <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" required />
                <input type="tel" placeholder="Téléphone" className="w-full p-2 border rounded-md" required />
                <input type="text" placeholder="Parti Politique" className="w-full p-2 border rounded-md" />
                <input type="text" placeholder="Slogan" className="w-full p-2 border rounded-md" required />
                <input type="file" accept="image/*" className="w-full p-2 border rounded-md" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {formData.colors.map((color, index) => (
                  <input
                    key={index}
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-full h-10"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
              >
                Enregistrer la Candidature
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
