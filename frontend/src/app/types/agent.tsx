export type AgentData = {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    empreinteSHA: string;
    fichiers?: {
      checksum: string; nom: string; chemin: string; type: string; taille: number 
}[];
    periodes?: { dateDebut: Date; dateFin: Date; description?: string }[];
    checkOnly?: boolean;
  };

  export type AgentLoginData = {
    email: string;
    password: string
  }
  

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const storeAuthData = (token: string, agentId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('agentId', agentId);
  }
};

export const getAgentId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('agentId');
  }
  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('agentId');
  }
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
