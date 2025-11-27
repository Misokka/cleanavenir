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
        credentials
      );

      // Les cookies sont gérés automatiquement par le backend (httpOnly)
      // Plus besoin de stocker le token manuellement

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
        userData
      );

      // Les cookies sont gérés automatiquement par le backend (httpOnly)

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
    }
    // Les cookies sont supprimés automatiquement par le backend
  }

  async getCurrentUser(): Promise<UserDTO> {
    try {
      const response = await httpClient.get<UserDTO>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new AuthenticationError('Session expirée, veuillez vous reconnecter');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
      return response.data;
    } catch (error) {
      throw new AuthenticationError('Impossible de rafraîchir la session');
    }
  }

  clearAuthToken(): void {
    // Méthode pour compatibilité - les cookies sont gérés par le backend
    // On pourrait forcer un logout ici si nécessaire
  }
}

export const authService = new AuthService();