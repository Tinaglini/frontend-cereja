export interface Usuario {
  id?: number;
  email: string;
  senha?: string; // Senha opcional após login
  nome?: string;
  role?: string;
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  tokenJWT?: string;
  token?: string;
  usuario?: Usuario;
  message?: string;
}

