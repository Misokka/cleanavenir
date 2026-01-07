import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RegisterResponse,
  UserDTO,
  AuthenticationError,
  ValidationError,
  EmailNotVerifiedError 
} from '../types';

export class AuthService {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      return response.data;
    } catch (error: any) {
      // Handle EMAIL_NOT_VERIFIED error from backend
      if (error?.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        throw new EmailNotVerifiedError(
          error.response.data.message || 'Votre compte n\'a pas encore été activé',
          error.response.data.email
        );
      }
      
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

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await httpClient.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      return response.data;
    } catch (error: any) {
      if (error?.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        throw new ValidationError('Cette adresse email est déjà utilisée', {
          email: ['Cette adresse email est déjà utilisée']
        });
      }
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

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.get<{ success: boolean; message: string }>(
        `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`
      );
      return response.data;
    } catch (error: any) {
      const errorCode = error?.response?.data?.error;
      const errorMessage = error?.response?.data?.message;
      
      if (errorCode === 'TOKEN_EXPIRED') {
        throw new Error('TOKEN_EXPIRED');
      }
      if (errorCode === 'TOKEN_INVALID') {
        throw new Error('TOKEN_INVALID');
      }
      
      throw new Error(errorMessage || 'Verification failed');
    }
  }

  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to resend verification email');
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Erreur lors de la déconnexion API:', error);
    }
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
  }
}

export const authService = new AuthService();
