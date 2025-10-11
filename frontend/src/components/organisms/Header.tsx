"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const currentLocale = pathname.split('/')[1] || 'en'; 


  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = newLocale;
    const newPath = "/" + segments.join("/");
    
    if (typeof window !== 'undefined') {
      window.location.href = newPath;
    }
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
            <Link href={`/${locale}/accounts`} className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('accounts')}
            </Link>
            <Link href={`/${locale}/transfer`} className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('transfer')}
            </Link>
            <Link href={`/${locale}/support`} className="text-gray-600 hover:text-clean-dark transition-colors">
              {t('support')}
            </Link>
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
            
            <Button variant="outline" size="sm">
              {t('login')}
            </Button>
            <Button size="sm">
              {t('signup')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
