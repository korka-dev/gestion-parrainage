"use client";

import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Switch } from "@mui/material";
import {
  CloudUpload as UploadCloudIcon,
  CalendarMonth as CalendarIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { setPeriodeParrainage } from "../../api/agents/periodeParrainage";
import { uploadFile } from "../../api/agents/routes/routeUpload";
import { getAgentId, clearAuthData } from "../../types/agent";
import { useRouter } from 'next/navigation';

export default function AgentGestion() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [checksum, setChecksum] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [view, setView] = useState("upload");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchAgentId = async () => {
      const id = getAgentId();
      console.log("Agent ID récupéré :", id);
      setAgentId(id);

      if (!id) {
        router.push('/interfaceAgent/login');
      }
    };

    fetchAgentId();
  }, [router]);

  useEffect(() => {
    if (errors.length > 0 || successMessage) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors, successMessage]);

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

    console.log("Agent ID utilisé pour l'upload :", agentId);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('checksum', checksum);
      formData.append('agentId', agentId);

      const result = await uploadFile(formData);

      if (result.success) {
        setSuccessMessage("Fichier validé avec succès.");
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
    clearAuthData();
    router.push('/interfaceAgent/login');
  };

  const handleManageCandidates = () => {
    router.push('/interfaceCandidat/register');
  };

  const handleSetPeriode = async () => {
    if (!startDate || !endDate || !agentId) {
      setErrors(["Veuillez remplir toutes les informations nécessaires."]);
      return;
    }

    const result = await setPeriodeParrainage({
      dateDebut: startDate,
      dateFin: endDate,
      description,
      agentId,
      active: isActive,
    });

    if (result.success) {
      setSuccessMessage("Période de parrainage mise à jour avec succès.");
      setErrors([]);
    } else {
      setErrors([result.error || "Une erreur est survenue lors de la mise à jour de la période de parrainage."]);
    }
  };

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
            onClick={handleManageCandidates}
            className="w-full md:w-auto text-white"
            style={darkGreenButtonStyle}
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

      <div className="flex-grow flex flex-col items-center justify-center mt-24 px-4 md:px-8">
        {errors.length > 0 && (
          <div className="mt-4 text-red-500 w-full max-w-lg">
            {errors.map((error, index) => (
              <div key={index} className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                {error}
              </div>
            ))}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-500 w-full max-w-lg">
            <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {successMessage}
            </div>
          </div>
        )}

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
              >
                Importer
              </Button>
            </CardContent>
          </Card>
        )}

        {view === "parrainage" && (
          <Card className="w-full max-w-lg p-6 bg-white shadow-xl rounded-3xl transform transition-all hover:scale-105">
            <CardContent>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Définir la Période de Parrainage</h2>
              <div className="space-y-4">
                <TextField
                  type="date"
                  label="Date de début"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="Date de fin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
                <div className="flex items-center">
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                  <span className="ml-2">Période active</span>
                </div>
              </div>
              <Button
                variant="contained"
                style={darkGreenButtonStyle}
                onClick={handleSetPeriode}
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
