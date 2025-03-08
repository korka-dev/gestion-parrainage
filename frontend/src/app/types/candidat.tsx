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

 
export type CandidatInfo = {
  id: string;
  numeroElecteur: string;
  numeroCNI: string;
  telephone: string;
  email: string;
  nom: string;
  prenom: string;
  parti: string;
  programme: string[];
  photoId?: string | null;
  couleurs: string[];
  code: string;
};

export interface CandidatLoginData {
  email: string;
  code: string;
}
