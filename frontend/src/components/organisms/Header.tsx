"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { useAuth } from '../../contexts/AuthProvider';
import { useLogout } from '../../features/auth/useLogin';

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const { isAuthenticated, user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  const currentLocale = pathname.split('/')[1] || 'en';
  const isAuthenticatedPage = pathname.includes('/dashboard') || 
                               pathname.includes('/client') || 
                               pathname.includes('/advisor') || 
                               pathname.includes('/admin');

  if (isAuthenticatedPage) {
    return null;
  } 


  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    const newPath = "/" + segments.join("/");
    
    if (globalThis.window !== undefined) {
      globalThis.window.location.href = newPath;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getLogoutButtonText = () => {
    if (logoutLoading) {
      return locale === 'fr' ? 'Déconnexion...' : 'Logging out...';
    }
    return t('logout');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-clean-dark rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CA</span>
            </div>
            <Typography variant="h4" color="primary">
              Clean Avenir
            </Typography>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('home')}
            </Link>
            <a href="#features" className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('features')}
            </a>
            <a href="#stats" className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('stats')}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => switchLocale("fr")}
                className={`px-3 py-1 text-sm transition-colors ${
                  currentLocale === "fr" 
                    ? "bg-clean-dark text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => switchLocale("en")}
                className={`px-3 py-1 text-sm transition-colors ${
                  currentLocale === "en" 
                    ? "bg-clean-dark text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                EN
              </button>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user && (
                  <Typography variant="body" className="hidden md:block text-gray-700">
                    {user.firstname}
                  </Typography>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  {getLogoutButtonText()}
                </Button>
              </div>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="outline" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/register`}>
                  <Button size="sm">
                    {t('signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
