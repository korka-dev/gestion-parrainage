"use client";

export default function Login() {
  // return <h1>Page de Connexion</h1>;
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/assemblee-nationale-senegal.jpg')",
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Contenu du formulaire */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
            Espace Candidat
          </h2>
          <p className="mt-2 mb-6 text-center text-sm text-gray-600">
            Demo: utilisez le code 12345
          </p>
          {/* <form className="space-y-6" onSubmit={handleSubmit}> */}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  // value={email}
                  // onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="authCode" className="block text-sm font-medium text-gray-700">
                Code d'authentification
              </label>
              <div className="mt-1">
                <input
                  id="authCode"
                  name="authCode"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  // value={authCode}
                  // onChange={(e) => setAuthCode(e.target.value)}
                />
              </div>
            </div>

            {/* {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )} */}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
