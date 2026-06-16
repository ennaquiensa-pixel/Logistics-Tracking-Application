export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  telephone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  userId: number;
  email: string;
  role: string;
  nom: string;
}

export interface User {
  userId: number;
  email: string;
  role: string;
  nom: string;
  
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}