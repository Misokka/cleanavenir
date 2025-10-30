'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FormFieldWithInput } from '../atoms/FormField';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { mockLogin, LoginCredentials } from '../../lib/api/auth.mock';

export const LoginForm: React.FC = () => {
  const t = useTranslations('Auth.login');
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};
    
    if (!formData.email) {
      newErrors.email = t('../validations.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('../validations.invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = t('../validations.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const response = await mockLogin(formData);
      
      if (response.success && response.user && response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        globalThis.location.href = '/fr'; 
      } else {
        const errorMessage = response.error || t('error');
        setSubmitError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('error');
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormFieldWithInput
        label={t('email')}
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        required
        placeholder="exemple@email.com"
        disabled={isLoading}
      />
      
      <FormFieldWithInput
        label={t('password')}
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        required
        placeholder="••••••••"
        disabled={isLoading}
      />
      
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Typography variant="caption" className="text-red-700">
            {submitError}
          </Typography>
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('submit')}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-[#3F6868] hover:text-[#083A31] transition-colors"
        >
          {t('forgot')}
        </button>
      </div>
      
      <div className="text-center pt-4 border-t border-gray-200">
        <Typography variant="caption" color="muted" className="mb-2">
          {t('noAccount')}
        </Typography>
        <br />
        <button
          type="button"
          className="text-sm font-medium text-[#083A31] hover:text-[#3F6868] transition-colors"
        >
          {t('register')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;