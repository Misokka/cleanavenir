'use client';

import React, { ReactNode, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '../atoms/Typography';
import { mockUserProfile } from '../../features/dashboard/mocks';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = mockUserProfile;

  const navigationItems = [
    {
      href: `/${locale}/dashboard`,
      label: t('navigation.overview'),
      icon: '',
      isActive: pathname === `/${locale}/dashboard`
    },
    {
      href: `/${locale}/dashboard/accounts`,
      label: t('navigation.accounts'),
      icon: '',
      isActive: pathname.startsWith(`/${locale}/dashboard/accounts`)
    },
    {
      href: `/${locale}/dashboard/savings`,
      label: t('navigation.savings'),
      icon: '',
      isActive: pathname === `/${locale}/dashboard/savings`
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    globalThis.location.href = `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-clean-light">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
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
          <Typography variant="body" className="font-medium text-clean-dark">
            {t('header.greeting', { firstName: user.firstName })}
          </Typography>
          <Typography variant="caption" color="muted">
            {t('header.welcome')}
          </Typography>
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
                  <span className="text-xl">{item.icon}</span>
                  <Typography variant="body" className={item.isActive ? 'text-white' : ''}>
                    {item.label}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full"
          >
            <Typography variant="body" className="text-red-600">
              {t('navigation.logout')}
            </Typography>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <Typography variant="h3" color="primary">
                {getCurrentPageTitle()}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="caption" color="muted">
                {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );

  function getCurrentPageTitle(): string {
    if (pathname === `/${locale}/dashboard`) return t('overview.title');
    if (pathname.startsWith(`/${locale}/dashboard/accounts`)) return t('accounts.title');
    if (pathname === `/${locale}/dashboard/savings`) return t('savings.title');
    return t('overview.title');
  }
};

export default DashboardLayout;