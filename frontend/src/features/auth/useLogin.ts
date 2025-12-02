import { useState, useCallback } from 'react';
import { authService } from '@/infrastructure/web/services/authService';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  LoginRequest, 
  AuthResponse, 
  MutationState,
  AuthenticationError,
  ValidationError 
} from '@/infrastructure/web/types';

export function useLogin() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse | null> => {
    setState({
      loading: true,
      error: null,
      success: false,
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

      if (error instanceof AuthenticationError) {
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
      }));

      return null;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    login,
    resetState,
    loading: state.loading,
    error: state.error,
    success: state.success,
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