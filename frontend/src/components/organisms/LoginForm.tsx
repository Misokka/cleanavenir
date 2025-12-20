'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormFieldWithInput } from '../atoms/FormField';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useLogin } from '../../features/auth/useLogin';
import { useAuth } from '../../contexts/AuthProvider';
import { userAgent } from 'next/server';

interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const t = useTranslations('Auth.login');
  const router = useRouter();
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const { setUser } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const result = await login({
      email: formData.email,
      password: formData.password
    });
    
    if (result?.user) {
      setUser(result.user);
      
      if (globalThis.window !== undefined) {
        const currentLocale = globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
        router.push(`/${currentLocale}/${result.user.role.toLocaleLowerCase()}/dashboard`);
      }
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
        disabled={loginLoading}
      />
      
      <FormFieldWithInput
        label={t('password')}
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        required
        placeholder="••••••••"
        disabled={loginLoading}
      />
      
      {loginError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Typography variant="caption" className="text-red-700">
            {loginError}
          </Typography>
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loginLoading}
      >
        {loginLoading ? t('loading') : t('submit')}
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
          onClick={() => {
            let currentLocale = 'fr';
            if (globalThis.window) {
              currentLocale = globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
            }
            router.push(`/${currentLocale}/auth/register`);
          }}
          className="text-sm font-medium text-[#083A31] hover:text-[#3F6868] transition-colors"
        >
          {t('register')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;