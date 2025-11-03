import { useState, useCallback } from 'react';
import { authService } from '@/infrastructure/web/services/authService';
import { 
  RegisterRequest, 
  AuthResponse, 
  MutationState,
  ValidationError 
} from '@/infrastructure/web/types';

export function useRegister() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse | null> => {
    if (userData.password !== userData.confirmation) {
      setState(prev => ({
        ...prev,
        error: 'Les mots de passe ne correspondent pas',
      }));
      return null;
    }

    if (!userData.email || !userData.password || !userData.firstname || !userData.lastname) {
      setState(prev => ({
        ...prev,
        error: 'Tous les champs sont obligatoires',
      }));
      return null;
    }

    setState({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const result = await authService.register(userData);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
      }));

      return result;
    } catch (error) {
      let errorMessage = 'Une erreur inattendue s\'est produite lors de l\'inscription';

      if (error instanceof ValidationError) {
        if (error.errors?.email) {
          errorMessage = 'Cette adresse email est déjà utilisée';
        } else if (error.errors?.confirmation) {
          errorMessage = 'Les mots de passe ne correspondent pas';
        } else {
          errorMessage = error.message;
        }
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

  const validatePassword = useCallback((password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  return {
    register,
    resetState,
    validatePassword,
    validateEmail,
    loading: state.loading,
    error: state.error,
    success: state.success,
  };
}

export function useRegisterValidation() {
  const [validationState, setValidationState] = useState({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirmation: { isValid: true, message: '' },
    firstname: { isValid: true, message: '' },
    lastname: { isValid: true, message: '' },
  });

  const validateField = useCallback((field: string, value: string, compareValue?: string) => {
    let isValid = true;
    let message = '';

    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid ? '' : 'Format d\'email invalide';
        break;

      case 'password':
        isValid = value.length >= 8;
        message = isValid ? '' : 'Le mot de passe doit contenir au moins 8 caractères';
        break;

      case 'confirmation':
        isValid = compareValue ? value === compareValue : true;
        message = isValid ? '' : 'Les mots de passe ne correspondent pas';
        break;

      case 'firstname':
      case 'lastname':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : 'Ce champ doit contenir au moins 2 caractères';
        break;
    }

    setValidationState(prev => ({
      ...prev,
      [field]: { isValid, message }
    }));

    return { isValid, message };
  }, []);

  const isFormValid = useCallback(() => {
    return Object.values(validationState).every(field => field.isValid);
  }, [validationState]);

  return {
    validationState,
    validateField,
    isFormValid,
  };
}