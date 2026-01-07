'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useAuth } from '@/features/auth/useAuth';
import { useLogout } from '@/features/auth/useLogin';
import { savingService, SavingDTO } from '@/infrastructure/web/services/savingService';
import { useRateChangeNotification } from '@/hooks/useRateChangeNotification';
import { RateChangeNotificationModal } from '../molecules/RateChangeNotificationModal';

interface DashboardLayoutProps {
  children: ReactNode;
}

type UserRole = 'CLIENT' | 'ADVISOR' | 'DIRECTOR';

interface NavigationItem {
  href: string;
  label: string;
  iconClass: string;
  isActive: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const t = useTranslations('Dashboard');
  const tLoans = useTranslations('Loans');
  const locale = useLocale();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [savings, setSavings] = useState<SavingDTO[] | null>(null);
  
  useEffect(() => {
    if (user?.role === 'CLIENT') {
      savingService.getSavings()
        .then(data => setSavings(data))
        .catch(err => {
          console.error('Error fetching savings:', err);
          setSavings(null);
        });
    } else {
      setSavings(null);
    }
  }, [user?.role]);
  
  const { rateChanges, showModal, setShowModal, handleAcknowledge } = useRateChangeNotification(savings);

  const currentLocale = pathname.split('/')[1] || 'en';

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newLocale;
    const newPath = '/' + segments.join('/');
    if (globalThis.window !== undefined) {
      globalThis.window.location.href = newPath;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getLogoutButtonText = () => {
    if (logoutLoading) {
      return t('header.loggingOut');
    }
    return t('navigation.logout');
  };

  const getNavigationItems = (role?: UserRole): NavigationItem[] => {
    const clientItems: NavigationItem[] = [
      {
        href: `/${locale}/client/dashboard`,
        label: t('navigation.overview'),
        iconClass: 'fi fi-br-home-location-alt',
        isActive: pathname === `/${locale}/client/dashboard`,
      },
      {
        href: `/${locale}/dashboard/accounts`,
        label: t('navigation.accounts'),
        iconClass: 'fi fi-br-credit-card',
        isActive: pathname.startsWith(`/${locale}/dashboard/accounts`),
      },
      {
        href: `/${locale}/dashboard/operations/transfer`,
        label: t('navigation.transfers'),
        iconClass: 'fi fi-br-paper-plane',
        isActive: pathname === `/${locale}/dashboard/operations/transfer`,
      },
      {
        href: `/${locale}/dashboard/beneficiaries`,
        label: t('navigation.beneficiaries'),
        iconClass: 'fi fi-br-users-alt',
        isActive: pathname.startsWith(`/${locale}/dashboard/beneficiaries`),
      },
      {
        href: `/${locale}/dashboard/savings`,
        label: t('navigation.savings'),
        iconClass: 'fi fi-br-piggy-bank',
        isActive: pathname.startsWith(`/${locale}/dashboard/savings`),
      },
      {
        href: `/${locale}/client/dashboard/loans`,
        label: t('navigation.loans'),
        iconClass: 'fi fi-br-hand-holding-usd',
        isActive: pathname.startsWith(`/${locale}/client/dashboard/loans`),
      },
      // {
      //   href: `/${locale}/dashboard/operations/history`,
      //   label: t('navigation.operations'),
      //   iconClass: 'fi fi-br-exchange-alt',
      //   isActive: pathname === `/${locale}/dashboard/operations/history`,
      // },
      {
        href: `/${locale}/client/investment`,
        label: t('navigation.investments'),
        iconClass: 'fi fi-br-chart-line-up',
        isActive: pathname.startsWith(`/${locale}/client/investment`),
      },
    ];

    const advisorItems: NavigationItem[] = [
      {
        href: `/${locale}/advisor/dashboard`,
        label: t('navigation.advisor.overview'),
        iconClass: 'fi fi-br-home-location-alt',
        isActive: pathname === `/${locale}/advisor/dashboard`,
      },
      {
        href: `/${locale}/advisor/clients`,
        label: t('navigation.advisor.clients'),
        iconClass: 'fi fi-br-users-alt',
        isActive: pathname.startsWith(`/${locale}/advisor/clients`),
      },
      {
        href: `/${locale}/advisor/loans`,
        label: t('navigation.advisor.loansToValidate'),
        iconClass: 'fi fi-br-check-circle',
        isActive: pathname.startsWith(`/${locale}/advisor/loans`),
      },
    ];

    const directorItems: NavigationItem[] = [
      {
        href: `/${locale}/director/dashboard`,
        label: t('navigation.director.overview'),
        iconClass: 'fi fi-br-chart-histogram',
        isActive: pathname.startsWith(`/${locale}/director/dashboard`),
      },
      {
        href: `/${locale}/director/accounts`,
        label: t('navigation.director.accounts'),
        iconClass: 'fi fi-br-users-alt',
        isActive: pathname.startsWith(`/${locale}/director/accounts`),
      },
      {
        href: `/${locale}/director/savings`,
        label: t('navigation.director.savings'),
        iconClass: 'fi fi-br-piggy-bank',
        isActive: pathname.startsWith(`/${locale}/director/savings`),
      },
      {
        href: `/${locale}/director/companies`,
        label: t('navigation.director.companies'),
        iconClass: 'fi fi-br-home-location-alt',
        isActive: pathname.startsWith(`/${locale}/director/companies`),
      },
      {
        href: `/${locale}/director/stocks`,
        label: t('navigation.director.stocks'),
        iconClass: 'fi fi-br-list-check',
        isActive: pathname.startsWith(`/${locale}/director/stocks`),
      },
    ];

    switch (role) {
      case 'ADVISOR':
        return advisorItems;
      case 'DIRECTOR':
        return directorItems;
      case 'CLIENT':
      default:
        return clientItems;
    }
  };

  const navigationItems = getNavigationItems(user?.role as UserRole);

  return (
    <div className="min-h-screen bg-clean-light">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          title={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <div className="w-5 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-clean-dark transition-transform ${isSidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 bg-clean-dark transition-opacity ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 bg-clean-dark transition-transform ${isSidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-200">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-clean-dark rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CA</span>
            </div>
            <Typography variant="h4" color="primary">
              Clean Avenir
            </Typography>
          </Link>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          {user && (
            <>
              <Typography variant="body" className="font-medium text-clean-dark">
                {t('header.greeting', { firstName: user.firstname })}
              </Typography>
              <Typography variant="caption" color="muted">
                {user.role === 'DIRECTOR' && 'Directeur'}
                {user.role === 'ADVISOR' && 'Conseiller'}
                {user.role === 'CLIENT' && 'Client'}
              </Typography>
            </>
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${item.isActive 
                      ? 'bg-clean-dark text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-clean-dark'
                    }
                  `}
                >
                  <span className="flex-shrink-0">
                    <i className={`${item.iconClass} ${item.isActive ? 'text-white' : 'text-clean-dark'}`} />
                  </span>
                  <Typography variant="body" className={item.isActive ? 'text-white' : ''}>
                    {item.label}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-gray-200"></div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center justify-center space-x-2"
          >
            <i className="fi fi-br-sign-out-alt" />
            <span>{getLogoutButtonText()}</span>
          </Button>
        </nav>
      </aside>

      <main className="lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <Typography variant="h3" color="primary">
                {getCurrentPageTitle()}
              </Typography>
            </div>
            <div className="flex items-center gap-4">
        
              <div className="hidden md:flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => switchLocale('fr')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    currentLocale === 'fr'
                      ? 'bg-clean-dark text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    currentLocale === 'en'
                      ? 'bg-clean-dark text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>

      <RateChangeNotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAcknowledge={handleAcknowledge}
        rateChanges={rateChanges}
      />
    </div>
  );

  function getCurrentPageTitle(): string {
    if (pathname.startsWith(`/${locale}/admin/statistics`)) return t('pageTitles.admin.statistics');
    if (pathname.startsWith(`/${locale}/admin/clients`)) return t('pageTitles.admin.clients');
    if (pathname.startsWith(`/${locale}/admin/settings`)) return t('pageTitles.admin.settings');
    
    if (pathname.startsWith(`/${locale}/advisor/clients`)) return t('pageTitles.advisor.clients');
    if (pathname.startsWith(`/${locale}/advisor/loans`)) return t('pageTitles.advisor.loans');
    if (pathname === `/${locale}/advisor/dashboard`) return t('pageTitles.advisor.dashboard');
     
    if (pathname === `/${locale}/client/dashboard`) return t('overview.title');
    if (pathname.startsWith(`/${locale}/dashboard/accounts`)) return t('accounts.title');
    if (pathname.startsWith(`/${locale}/dashboard/savings`)) return t('savings.title');
        if (pathname.startsWith(`/${locale}/client/dashboard/loans`)) return tLoans('title');
    if (pathname.startsWith(`/${locale}/client/dashboard/operations`)) return t('operations.title');
        if (pathname.startsWith(`/${locale}/client/dashboard/loans`)) return tLoans('title');

    if (pathname === `/${locale}/dashboard`) return t('overview.title');
    if (pathname.startsWith(`/${locale}/dashboard/accounts`)) return t('accounts.title');
    if (pathname === `/${locale}/dashboard/savings`) return t('savings.title');
    
    return t('overview.title');
  }
};

export default DashboardLayout;