export interface ElecteurData {
    electoralCard: string;
    nationalId: string;
    lastName: string;
    pollingStation: string;
    phone: string;
    email: string;
    code: string;
    photo?: string;
    checkOnly?: boolean; 
}

export interface ElecteurLoginData {
    electoralCard: string;
    code: string;
}

export type ElecteurInfo = {
    nom: string;
    bureauVote: string;
    telephone: string;
    email: string;
};

  
  