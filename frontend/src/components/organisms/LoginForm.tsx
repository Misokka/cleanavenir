'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { FormFieldWithInput } from '../atoms/FormField';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useLogin } from '../../features/auth/useLogin';
import { useAuth } from '../../contexts/AuthProvider';

interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const t = useTranslations('Auth.login');
  const router = useRouter();
  const locale = useLocale();
  const { 
    login, 
    resendVerificationEmail,
    loading: loginLoading, 
    error: loginError,
    emailNotVerified,
    unverifiedEmail 
  } = useLogin();
  const { setUser } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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
    setResendSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    const result = await login({
      email: formData.email,
      password: formData.password
    });
    
    if (result?.user) {
      setUser(result.user);
      router.push(`/${locale}/${result.user.role.toLocaleLowerCase()}/dashboard`);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    const success = await resendVerificationEmail(unverifiedEmail);
    
    setResendLoading(false);
    if (success) {
      setResendSuccess(true);
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
      
      {emailNotVerified && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Typography variant="caption" className="text-yellow-800 block mb-2">
            {t('emailNotVerified', { defaultValue: 'Votre compte n\'a pas encore été activé. Veuillez vérifier votre email.' })}
          </Typography>
          
          {resendSuccess ? (
            <Typography variant="caption" className="text-green-700">
              {t('verificationEmailSent', { defaultValue: 'Un nouvel email de vérification a été envoyé.' })}
            </Typography>
          ) : (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="text-sm text-[#3F6868] hover:text-[#083A31] transition-colors underline"
            >
              {resendLoading 
                ? t('resendingEmail', { defaultValue: 'Envoi en cours...' }) 
                : t('resendVerificationEmail', { defaultValue: 'Renvoyer l\'email de vérification' })}
            </button>
          )}
        </div>
      )}
      
      {loginError && !emailNotVerified && (
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
            router.push(`/${locale}/auth/register`);
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