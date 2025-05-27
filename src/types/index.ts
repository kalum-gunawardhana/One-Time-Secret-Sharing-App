export interface User {
  id: number;
  email: string;
  created_at?: string;
}

export interface Secret {
  id?: number;
  token?: string;
  message: string;
  password: string;
  user_id?: number;
  created_at?: string;
}

export interface AccessLog {
  id: number;
  secret_token: string;
  success: boolean;
  ip_address: string;
  user_agent: string;
  attempted_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  message?: string;
  secretPassword?: string;
}