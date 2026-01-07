import { useState, useCallback } from 'react';
import { authService } from '@/infrastructure/web/services/authService';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  LoginRequest, 
  AuthResponse, 
  MutationState,
  AuthenticationError,
  ValidationError,
  EmailNotVerifiedError 
} from '@/infrastructure/web/types';

interface LoginState extends MutationState {
  emailNotVerified: boolean;
  unverifiedEmail: string | null;
}

export function useLogin() {
  const [state, setState] = useState<LoginState>({
    loading: false,
    error: null,
    success: false,
    emailNotVerified: false,
    unverifiedEmail: null,
  });

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse | null> => {
    setState({
      loading: true,
      error: null,
      success: false,
      emailNotVerified: false,
      unverifiedEmail: null,
    });

    try {
      const result = await authService.login(credentials);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
      }));

      return result;
    } catch (error) {
      let errorMessage = 'Une erreur inattendue s\'est produite';
      let emailNotVerified = false;
      let unverifiedEmail: string | null = null;

      if (error instanceof EmailNotVerifiedError) {
        emailNotVerified = true;
        unverifiedEmail = error.email;
        errorMessage = error.message;
      } else if (error instanceof AuthenticationError) {
        errorMessage = 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
      } else if (error instanceof ValidationError) {
        errorMessage = 'Veuillez remplir tous les champs requis.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        emailNotVerified,
        unverifiedEmail,
      }));

      return null;
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      await authService.resendVerificationEmail(email);
      return true;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      return false;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      emailNotVerified: false,
      unverifiedEmail: null,
    });
  }, []);

  return {
    login,
    resendVerificationEmail,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
    emailNotVerified: state.emailNotVerified,
    unverifiedEmail: state.unverifiedEmail,
  };
}


export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { clearUser } = useAuth();

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      await authService.logout();
      
      authService.clearAuthToken();
      
      clearUser();
      
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = '/fr/auth/login';
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      authService.clearAuthToken();
      clearUser();
      
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = '/fr/auth/login';
      }
    } finally {
      setLoading(false);
    }
  }, [clearUser]);

  return {
    logout,
    loading,
  };
}