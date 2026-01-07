'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormFieldWithInput, FormField } from '../atoms/FormField';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useRegister } from '../../features/auth/useRegister';
import { UserRole } from '../../infrastructure/web/types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'client' | 'business' | 'premium';
}

export const RegisterForm: React.FC = () => {
  const t = useTranslations('Auth.register');
  const tRoles = useTranslations('Auth.roles');
  const tValidations = useTranslations('Auth.validations');
  const router = useRouter();
  const { register, loading: registerLoading, error: registerError } = useRegister();
  
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};
    
    if (!formData.firstName) {
      newErrors.firstName = tValidations('required');
    }
    
    if (!formData.lastName) {
      newErrors.lastName = tValidations('required');
    }
    
    if (!formData.email) {
      newErrors.email = tValidations('required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = tValidations('invalidEmail');
    }
    
    if (!formData.password) {
      newErrors.password = tValidations('required');
    } else if (formData.password.length < 8) {
      newErrors.password = tValidations('minLength', { count: 8 });
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = tValidations('required');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordMismatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    
    if (field === 'password' && formData.confirmPassword) {
      const isMatch = e.target.value === formData.confirmPassword;
      setErrors(prev => ({
        ...prev,
        confirmPassword: isMatch ? undefined : t('errors.passwordMismatch')
      }));
    }
    
    if (field === 'confirmPassword' && formData.password) {
      const isMatch = e.target.value === formData.password;
      setErrors(prev => ({
        ...prev,
        confirmPassword: isMatch ? undefined : t('errors.passwordMismatch')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const roleMapping = {
      'client': 'CLIENT',
      'business': 'ADVISOR',  
      'premium': 'CLIENT'
    } as const;
    
    const result = await register({
      email: formData.email,
      password: formData.password,
      confirmation: formData.confirmPassword,
      firstname: formData.firstName,
      lastname: formData.lastName,
      role: roleMapping[formData.role] as UserRole
    });
    
    if (result?.requiresVerification) {
      if (globalThis.window !== undefined) {
        const currentLocale = globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
        router.push(`/${currentLocale}/auth/check-email?email=${encodeURIComponent(result.email)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormFieldWithInput
          label={t('firstName')}
          type="text"
          value={formData.firstName}
          onChange={handleInputChange('firstName')}
          error={errors.firstName}
          required
          placeholder="Jean"
          disabled={registerLoading}
        />
        
        <FormFieldWithInput
          label={t('lastName')}
          type="text"
          value={formData.lastName}
          onChange={handleInputChange('lastName')}
          error={errors.lastName}
          required
          placeholder="Dupont"
          disabled={registerLoading}
        />
      </div>
      
      <FormFieldWithInput
        label={t('email')}
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        required
        placeholder="exemple@email.com"
        disabled={registerLoading}
      />
      
      <FormField
        label={t('role')}
        required
      >
        <select
          value={formData.role}
          onChange={handleInputChange('role')}
          disabled={registerLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083A31] focus:border-[#083A31] text-gray-900"
        >
          <option value="client">{tRoles('client')}</option>
          <option value="business">{tRoles('business')}</option>
          <option value="premium">{tRoles('premium')}</option>
        </select>
      </FormField>
      
      <FormFieldWithInput
        label={t('password')}
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        required
        placeholder="••••••••"
        disabled={registerLoading}
      />
      
      <FormFieldWithInput
        label={t('confirmPassword')}
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        error={errors.confirmPassword}
        required
        placeholder="••••••••"
        disabled={registerLoading}
      />
      
      {registerError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <Typography variant="caption" className="text-red-700">
            {registerError}
          </Typography>
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={registerLoading}
      >
        {registerLoading ? t('loading') : t('submit')}
      </Button>
      
      <div className="text-center pt-4 border-t border-gray-200">
        <Typography variant="caption" color="muted" className="mb-2">
          {t('hasAccount')}
        </Typography>
        <br />
        <button
          type="button"
          onClick={() => {
            let currentLocale = 'fr';
            if (globalThis.window) {
              currentLocale = globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
            }
            router.push(`/${currentLocale}/auth/login`);
          }}
          className="text-sm font-medium text-[#083A31] hover:text-[#3F6868] transition-colors"
        >
          {t('login')}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;