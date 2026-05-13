export interface AuthPayload {
  id: string;
  telephone: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    role: string;
  };
}
