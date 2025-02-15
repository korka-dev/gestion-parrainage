import { ArrowLeftIcon, ChartBarIcon, UserGroupIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">SenParrainage Électoral</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Accueil
              </Link>
              <Link href="/candidats" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Candidats
              </Link>
              <Link href="/verification" className="text-white hover:bg-green-500 px-3 py-2 rounded-md">
                Vérification
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Parrainages</h3>
                <p className="text-2xl font-semibold text-green-600">44,280</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Parrainages Validés</h3>
                <p className="text-2xl font-semibold text-green-600">42,150</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Progression</h3>
                <p className="text-2xl font-semibold text-green-600">84.3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau détaillé */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Détails des Parrainages par Région</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Région
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Parrainages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    En attente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { region: 'Dakar', total: 15000, valides: 14200, enAttente: 800, progression: 94.6 },
                  { region: 'Thiès', total: 8500, valides: 8000, enAttente: 500, progression: 94.1 },
                  { region: 'Saint-Louis', total: 6200, valides: 5800, enAttente: 400, progression: 93.5 },
                  { region: 'Ziguinchor', total: 4800, valides: 4500, enAttente: 300, progression: 93.8 },
                  { region: 'Kaolack', total: 5100, valides: 4800, enAttente: 300, progression: 94.1 },
                ].map((region, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {region.valides.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">
                      {region.enAttente.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.progression}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}