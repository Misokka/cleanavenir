import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserDTO,
  AuthenticationError,
  ValidationError 
} from '../types';

export class AuthService {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        false 
      );

      if (response.data.token) {
        httpClient.setAuthToken(response.data.token, true); 
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid credentials') || 
            error.message.includes('MissingCredentialsError') ||
            error.message.includes('InvalidCredentialsError')) {
          throw new AuthenticationError(error.message);
        }
      }
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        false 
      );

      if (response.data.token) {
        httpClient.setAuthToken(response.data.token, true);
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('EmailAlreadyUsedError')) {
          throw new ValidationError('Cette adresse email est déjà utilisée', {
            email: ['Cette adresse email est déjà utilisée']
          });
        }
        if (error.message.includes('PasswordDoNotMatchError')) {
          throw new ValidationError('Les mots de passe ne correspondent pas', {
            confirmation: ['Les mots de passe ne correspondent pas']
          });
        }
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Erreur lors de la déconnexion API:', error);
    } finally {
      httpClient.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<UserDTO> {
    try {
      const response = await httpClient.get<UserDTO>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        httpClient.clearAuthToken();
        throw new AuthenticationError('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
      
      if (response.data.token) {
        httpClient.setAuthToken(response.data.token, true);
      }
      
      return response.data;
    } catch (error) {
      httpClient.clearAuthToken();
      throw new AuthenticationError('Impossible de rafraîchir la session');
    }
  }

  isAuthenticated(): boolean {
    if (typeof globalThis.window === 'undefined') return false;
    
    return !!(
      localStorage.getItem('authToken') || 
      sessionStorage.getItem('authToken')
    );
  }

  getCurrentToken(): string | null {
    if (typeof globalThis.window === 'undefined') return null;
    
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken');
  }
}

export const authService = new AuthService();