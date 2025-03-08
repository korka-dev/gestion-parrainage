"use client";
import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { 
  CloudUpload as UploadCloudIcon, 
  People as UsersIcon, 
  CalendarMonth as CalendarIcon,
  Logout as LogoutIcon 
} from "@mui/icons-material";
import { uploadFile } from "../../api/agents/upload";

export default function ElectionAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [checksum, setChecksum] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [view, setView] = useState("upload");
  const [candidateData, setCandidateData] = useState({ name: "", email: "", phone: "", party: "", slogan: "", colors: "", photo: "", url: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agentId, setAgentId] = useState<string | null>(null);

  // Fetch the current agent's ID on component mount
  useEffect(() => {
    // This is a placeholder - you should implement proper authentication
    // and retrieve the agent ID from your auth system or context
    const fetchAgentId = async () => {
      // Example: Get from localStorage, session, or context
      const id = localStorage.getItem("agentId");
      setAgentId(id);
    };
    
    fetchAgentId();
  }, []);

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

    if (!agentId) {
      setErrors(["Vous devez être connecté pour importer un fichier."]);
      return;
    }

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData();
      formData.append('file', file);
      formData.append('checksum', checksum);
      formData.append('agentId', agentId);
      
      // Call the server action with FormData
      const result = await uploadFile(formData);
      
      if (result.success) {
        setSuccessMessage("Fichier validé avec succès !");
        setErrors([]);
      } else {
        setErrors([result.error || "Une erreur est survenue lors de l'upload."]);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setErrors([error.message || "Une erreur est survenue lors de l'upload."]);
    }
  };

  const handleLogout = () => {
    // Implémentation de la déconnexion ici
    localStorage.removeItem("agentId");
    console.log("Déconnexion");
    // Redirect to login page
  };

  // Couleur vert foncé pour les boutons
  const darkGreenButtonStyle = { backgroundColor: '#2e7d32' };

  return (
    <div className="min-h-screen bg-green-200 flex flex-col p-4 md:p-8">
      <nav className="fixed top-0 left-0 right-0 z-10 flex flex-wrap justify-between gap-4 bg-white shadow-md p-4 rounded-b-2xl">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="contained"
            onClick={() => setView("upload")}
            className="w-full md:w-auto text-white"
            style={darkGreenButtonStyle}
            startIcon={<UploadCloudIcon />}
          >
            Importer Électeurs
          </Button>
          <Button
            variant="contained"
            onClick={() => setView("candidats")}
            className="w-full md:w-auto text-white"
            style={darkGreenButtonStyle}
            startIcon={<UsersIcon />}
          >
            Gérer Candidats
          </Button>
          <Button
            variant="contained"
            onClick={() => setView("parrainage")}
            className="w-full md:w-auto text-white"
            style={darkGreenButtonStyle}
            startIcon={<CalendarIcon />}
          >
            Période de Parrainage
          </Button>
        </div>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          className="w-full md:w-auto"
          startIcon={<LogoutIcon />}
        >
          Déconnexion
        </Button>
      </nav>

      <div className="flex-grow flex items-center justify-center mt-24">
        {view === "upload" && (
          <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
            <CardContent>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Importer la liste des électeurs</h2>
              <TextField
                label="Empreinte SHA256"
                value={checksum}
                onChange={(e) => setChecksum(e.target.value)}
                className="mb-4 w-full"
              />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mb-6 bg-gray-100 border border-gray-300 rounded-lg p-3 w-full"
              />
              <Button
                variant="contained"
                style={darkGreenButtonStyle}
                startIcon={<UploadCloudIcon />}
                onClick={handleUpload}
                className="w-full text-white"
                disabled={!agentId}
              >
                Importer
              </Button>
              {errors.length > 0 && (
                <div className="mt-4 text-red-500">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              {successMessage && (
                <div className="mt-4 text-green-500">
                  <p>{successMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {view === "candidats" && (
          <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
            <CardContent>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Saisie des Candidats</h2>
              <div className="space-y-4">
                <TextField label="Nom" className="w-full" />
                <TextField label="Email" className="w-full" />
                <TextField label="Téléphone" className="w-full" />
                <TextField label="Parti Politique" className="w-full" />
                <TextField label="Slogan" className="w-full" />
                <TextField label="Couleurs du Parti" className="w-full" />
                <input type="file" accept="image/*" className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3" />
                <TextField label="Lien vers une page" className="w-full" />
              </div>
              <Button 
                variant="contained" 
                style={darkGreenButtonStyle}
                className="w-full mt-6 text-white"
              >
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
                <TextField type="date" label="Date de début" className="w-full" InputLabelProps={{ shrink: true }} />
                <TextField type="date" label="Date de fin" className="w-full" InputLabelProps={{ shrink: true }} />
              </div>
              <Button 
                variant="contained" 
                style={darkGreenButtonStyle}
                className="w-full mt-6 text-white"
              >
                Enregistrer Période
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}