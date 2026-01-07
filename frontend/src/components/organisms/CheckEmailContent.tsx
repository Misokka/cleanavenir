'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { authService } from '../../infrastructure/web/services/authService';

interface CheckEmailContentProps {
  email?: string;
}

export const CheckEmailContent: React.FC<CheckEmailContentProps> = ({ email }) => {
  const t = useTranslations('Auth.checkEmail');
  const router = useRouter();
  const locale = useLocale();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    setResendError(null);
    
    try {
      await authService.resendVerificationEmail(email);
      setResendSuccess(true);
    } catch (error) {
      setResendError(t('resendError', { defaultValue: 'Erreur lors de l\'envoi. Veuillez réessayer.' }));
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-[#083A31]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-[#083A31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      <Typography variant="h3" className="mb-4 text-[#083A31]">
        {t('mainTitle', { defaultValue: 'Vérifiez votre email' })}
      </Typography>
      
      <Typography variant="body" color="muted" className="mb-2">
        {t('message', { defaultValue: 'Nous avons envoyé un email de vérification à :' })}
      </Typography>
      
      {email && (
        <Typography variant="subtitle" className="font-semibold text-[#083A31] mb-6">
          {email}
        </Typography>
      )}
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <Typography variant="body" color="muted">
          {t('instruction', { defaultValue: 'Cliquez sur le lien dans l\'email pour activer votre compte. Ensuite, vous pourrez vous connecter.' })}
        </Typography>
      </div>
      
      <Button onClick={handleGoToLogin} variant="primary" className="w-full mb-4">
        {t('goToLogin', { defaultValue: 'Aller à la page de connexion' })}
      </Button>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <Typography variant="caption" color="muted" className="mb-3 block">
          {t('noEmailReceived', { defaultValue: 'Vous n\'avez pas reçu l\'email ?' })}
        </Typography>
        
        {resendSuccess ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <Typography variant="caption" className="text-green-700">
              {t('resendSuccess', { defaultValue: 'Un nouvel email de vérification a été envoyé !' })}
            </Typography>
          </div>
        ) : resendError ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
            <Typography variant="caption" className="text-red-700">
              {resendError}
            </Typography>
          </div>
        ) : null}
        
        {!resendSuccess && email && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="text-sm text-[#3F6868] hover:text-[#083A31] transition-colors underline disabled:opacity-50"
          >
            {resendLoading 
              ? t('resending', { defaultValue: 'Envoi en cours...' })
              : t('resendButton', { defaultValue: 'Renvoyer l\'email de vérification' })}
          </button>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="caption" className="text-yellow-800">
          {t('spamWarning', { defaultValue: 'Pensez à vérifier votre dossier spam ou courrier indésirable.' })}
        </Typography>
      </div>
    </div>
  );
};

export default CheckEmailContent;
