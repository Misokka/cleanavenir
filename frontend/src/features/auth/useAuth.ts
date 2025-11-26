import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/infrastructure/web/services/authService';
import { UserDTO, AsyncState, AuthenticationError } from '@/infrastructure/web/types';

export function useAuth() {
  const [authState, setAuthState] = useState<AsyncState<UserDTO>>({
    data: null,
    loading: true, 
    error: null,
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    if (hasChecked) return; // Ne vérifier qu'une seule fois
    
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        
        setAuthState({
          data: user,
          loading: false,
          error: null,
        });
        setIsAuthenticated(true);
      } catch (error) {
        // Si l'utilisateur n'est pas connecté (401), c'est normal, pas d'erreur à afficher
        setAuthState({
          data: null,
          loading: false,
          error: null,
        });
        setIsAuthenticated(false);
      } finally {
        setHasChecked(true);
      }
    };

    checkAuthStatus();
  }, [hasChecked]); 

  const refetchUser = useCallback(async () => {
    setAuthState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const user = await authService.getCurrentUser();
      
      setAuthState({
        data: user,
        loading: false,
        error: null,
      });
      setIsAuthenticated(true);
    } catch (error) {
      let errorMessage = 'Erreur lors du rafraîchissement des données';
      
      if (error instanceof AuthenticationError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAuthState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      setIsAuthenticated(false);
      authService.clearAuthToken();
    }
  }, []);

  const setUser = useCallback((user: UserDTO) => {
    setAuthState({
      data: user,
      loading: false,
      error: null,
    });
    setIsAuthenticated(true);
  }, []);

  const clearUser = useCallback(() => {
    setAuthState({
      data: null,
      loading: false,
      error: null,
    });
    setIsAuthenticated(false);
  }, []);

  return {
    user: authState.data,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated,
    refetchUser,
    setUser,
    clearUser,
  };
}

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = useCallback((role: UserDTO['role']): boolean => {
    return isAuthenticated && user?.role === role;
  }, [user, isAuthenticated]);

  const hasAnyRole = useCallback((roles: UserDTO['role'][]): boolean => {
    return isAuthenticated && user?.role !== undefined && roles.includes(user.role);
  }, [user, isAuthenticated]);

  const isClient = useCallback((): boolean => {
    return hasRole('CLIENT');
  }, [hasRole]);

  const isAdvisor = useCallback((): boolean => {
    return hasRole('ADVISOR');
  }, [hasRole]);

  const isDirector = useCallback((): boolean => {
    return hasRole('DIRECTOR');
  }, [hasRole]);

  const canManageAccounts = useCallback((): boolean => {
    return hasAnyRole(['ADVISOR', 'DIRECTOR']);
  }, [hasAnyRole]);

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isClient,
    isAdvisor,
    isDirector,
    canManageAccounts,
  };
}