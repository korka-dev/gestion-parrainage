'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Users, Calendar, LogIn, LogOut } from "lucide-react";

export default function ElectionAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [checksum, setChecksum] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [view, setView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [candidateData, setCandidateData] = useState({ name: "", email: "", phone: "", party: "", slogan: "", colors: "", photo: "", url: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Fichier sélectionné :", file);
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file || !checksum) {
      setErrors(["Veuillez sélectionner un fichier et fournir une empreinte SHA256."]);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("checksum", checksum);

    try {
      const response = await fetch("/api/upload-electeurs", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Fichier validé avec succès !");
        setErrors([]);
      } else {
        setErrors(result.errors || ["Une erreur est survenue lors de l'upload."]);
      }
    } catch (error) {
      setErrors(["Une erreur réseau est survenue."]);
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setLoggedIn(true);
      setView("upload");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setView("login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-500 to-green-700 p-4 md:p-8">
      {loggedIn && (
        <nav className="flex flex-wrap justify-center gap-4 mb-6 bg-white shadow-md p-4 rounded-2xl">
          <Button
            onClick={() => setView("upload")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full md:w-auto"
          >
            <UploadCloud className="w-6 h-6" /> Importer Électeurs
          </Button>
          <Button
            onClick={() => setView("candidats")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full md:w-auto"
          >
            <Users className="w-6 h-6" /> Gérer Candidats
          </Button>
          <Button
            onClick={() => setView("parrainage")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full md:w-auto"
          >
            <Calendar className="w-6 h-6" /> Période de Parrainage
          </Button>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg w-full md:w-auto"
          >
            <LogOut className="w-6 h-6" /> Se Déconnecter
          </Button>
        </nav>
      )}

      <div className="flex-grow flex items-center justify-center">
        {!loggedIn ? (
          <Card className="w-full max-w-md p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
            <CardContent>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Connexion</h2>
              <Input
                type="email"
                placeholder="Adresse Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Button
                onClick={handleLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <LogIn className="w-6 h-6 mr-2" /> Se Connecter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {view === "upload" && (
              <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
                <CardContent>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Importer la liste des électeurs</h2>
                  <Input
                    type="text"
                    placeholder="Empreinte SHA256"
                    value={checksum}
                    onChange={(e) => setChecksum(e.target.value)}
                    className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mb-6 bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Button
                    onClick={handleUpload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <UploadCloud className="w-6 h-6 mr-2" /> Importer
                  </Button>
                </CardContent>
              </Card>
            )}

            {view === "candidats" && (
              <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
                <CardContent>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Saisie des Candidats</h2>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Nom"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="text"
                      placeholder="Téléphone"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="text"
                      placeholder="Parti Politique"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="text"
                      placeholder="Slogan"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="text"
                      placeholder="Couleurs du Parti"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="text"
                      placeholder="Lien vers une page"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg">
                    Enregistrer Candidat
                  </Button>
                </CardContent>
              </Card>
            )}

            {view === "parrainage" && (
              <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
                <CardContent>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Définir la Période de Parrainage</h2>
                  <div className="space-y-4">
                    <Input
                      type="date"
                      placeholder="Date de début"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Input
                      type="date"
                      placeholder="Date de fin"
                      className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg">
                    Enregistrer Période
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
