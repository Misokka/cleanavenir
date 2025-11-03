'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useAuth } from '../../contexts/AuthProvider';
import { useLogout } from '../../features/auth/useLogin';

export const DashboardHeader: React.FC = () => {
  const t = useTranslations('Dashboard.header');
  const tNav = useTranslations('Dashboard.navigation');
  const locale = useLocale();
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 rounded-xl mb-6">
      <div className="flex justify-between items-center">
        <div>
          {userLoading && (
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          )}
          
          {!userLoading && user && (
            <>
              <Typography variant="h2" className="text-gray-900 mb-1">
                {t('greeting', { firstName: user.firstname })}
              </Typography>
              <Typography variant="body" color="muted">
                {t('welcome')}
              </Typography>
            </>
          )}
          
          {!userLoading && !user && (
            <Typography variant="h2" className="text-gray-900">
              {t('welcome')}
            </Typography>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <Typography variant="caption" color="muted">
              {t('today')}
            </Typography>
            <Typography variant="body" className="text-gray-700">
              {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </div>

          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center space-x-2 px-4 py-2"
          >
            {logoutLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                <Typography variant="caption">
                  Déconnexion...
                </Typography>
              </>
            ) : (
              <>
                <span className="text-lg">🚪</span>
                <Typography variant="caption">
                  {tNav('logout')}
                </Typography>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;