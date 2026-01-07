'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { authService } from '../../infrastructure/web/services/authService';

interface VerifyEmailContentProps {
  token?: string;
}

type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid' | 'no-token';

export const VerifyEmailContent: React.FC<VerifyEmailContentProps> = ({ token }) => {
  const t = useTranslations('Auth.verifyEmail');
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'TOKEN_EXPIRED') {
            setStatus('expired');
          } else if (error.message === 'TOKEN_INVALID') {
            setStatus('invalid');
          } else {
            setStatus('invalid');
          }
        } else {
          setStatus('invalid');
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      await authService.resendVerificationEmail(resendEmail);
      setResendSuccess(true);
    } catch (error) {
      console.error('Failed to resend:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToLogin = () => {
    let currentLocale = 'fr';
    if (globalThis.window) {
      currentLocale = globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
    }
    router.push(`/${currentLocale}/auth/login`);
  };

  const getCurrentLocale = () => {
    if (globalThis.window) {
      return globalThis.location.pathname.startsWith('/fr') ? 'fr' : 'en';
    }
    return 'fr';
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#083A31] mx-auto mb-4"></div>
        <Typography variant="body">
          {t('verifying', { defaultValue: 'Vérification en cours...' })}
        </Typography>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <Typography variant="h3" className="mb-2 text-green-800">
          {t('successTitle', { defaultValue: 'Email vérifié !' })}
        </Typography>
        <Typography variant="body" color="muted" className="mb-6">
          {t('successMessage', { defaultValue: 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.' })}
        </Typography>
        <Button onClick={handleGoToLogin} variant="primary">
          {t('goToLogin', { defaultValue: 'Se connecter' })}
        </Button>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Typography variant="h3" className="mb-2 text-yellow-800">
          {t('expiredTitle', { defaultValue: 'Lien expiré' })}
        </Typography>
        <Typography variant="body" color="muted" className="mb-6">
          {t('expiredMessage', { defaultValue: 'Ce lien de vérification a expiré. Veuillez demander un nouveau lien.' })}
        </Typography>
        
        <div className="max-w-sm mx-auto space-y-4">
          <input
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder={t('emailPlaceholder', { defaultValue: 'Votre adresse email' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F6868]"
          />
          
          {resendSuccess ? (
            <Typography variant="caption" className="text-green-700">
              {t('resendSuccess', { defaultValue: 'Un nouvel email de vérification a été envoyé.' })}
            </Typography>
          ) : (
            <Button 
              onClick={handleResendVerification} 
              variant="primary"
              className="w-full"
              disabled={resendLoading || !resendEmail}
            >
              {resendLoading 
                ? t('resending', { defaultValue: 'Envoi en cours...' })
                : t('resendButton', { defaultValue: 'Renvoyer l\'email' })}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'invalid' || status === 'no-token') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <Typography variant="h3" className="mb-2 text-red-800">
          {t('invalidTitle', { defaultValue: 'Lien invalide' })}
        </Typography>
        <Typography variant="body" color="muted" className="mb-6">
          {status === 'no-token'
            ? t('noTokenMessage', { defaultValue: 'Aucun token de vérification fourni.' })
            : t('invalidMessage', { defaultValue: 'Ce lien de vérification est invalide ou a déjà été utilisé.' })}
        </Typography>
        <Button onClick={handleGoToLogin} variant="outline">
          {t('backToLogin', { defaultValue: 'Retour à la connexion' })}
        </Button>
      </div>
    );
  }

  return null;
};

export default VerifyEmailContent;
