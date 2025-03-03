// types/candidat.ts
export interface CandidatData {
    numeroElecteur: string;
    numeroCNI: string;
    nom: string;
    prenom: string;
    parti: string;
    telephone: string;
    email: string;
    code: string;
    photoId: string;
    programme: string[];
    couleurs: string[];
    checkOnly?: boolean;
  }

  export interface CandidatLoginData {
    email: string;
    code: string;
}
