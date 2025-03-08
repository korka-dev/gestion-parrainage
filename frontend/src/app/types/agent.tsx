export type AgentData = {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    empreinteSHA: string;
    fichiers?: { nom: string; chemin: string; type: string; taille: number }[];
    periodes?: { dateDebut: Date; dateFin: Date; description?: string }[];
    checkOnly?: boolean;
  };

  export type AgentLoginData = {
    email: string;
    password: string
  }
  