"use client";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Typography } from '../atoms/Typography';
import Link from "next/link";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const pathname = usePathname();
  const hassidebar = pathname.includes('/dashboard') || 
                      pathname.includes('/client') || 
                      pathname.includes('/advisor') || 
                      pathname.includes('/admin');

  return (
    <footer className={`bg-clean-dark text-white py-12 ${hassidebar ? 'lg:ml-64' : ''}`}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-clean-dark text-sm font-bold">CA</span>
              </div>
              <Typography variant="h4" color="white">
                Clean Avenir
              </Typography>
            </div>
            <Typography color="white" className="opacity-80 max-w-md">
              {t('tagline')}
            </Typography>
          </div>

          <div>
            <Typography variant="h4" color="white" className="mb-4">
              Navigation
            </Typography>
            <div className="space-y-2">
              <Link href={`/${locale}/about`} className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('about')}
              </Link>
              <Link href={`/${locale}/contact`} className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('contact')}
              </Link>
              <Link href={`/${locale}/legal`} className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('legal')}
              </Link>
              <Link href={`/${locale}/privacy`} className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('privacy')}
              </Link>
            </div>
          </div>

          <div>
            <Typography variant="h4" color="white" className="mb-4">
              Contact
            </Typography>
            <div className="space-y-2 text-white opacity-80">
              <p>contact@cleanavenir.fr</p>
              <p>+33 1 23 45 67 89</p>
            </div>
          </div>
        </div>

        <div className="border-t border-clean-secondary mt-12 pt-8">
          <Typography className="text-center opacity-80" color="white">
            {t('copyright')}
          </Typography>
        </div>
      </div>
    </footer>
  );
}
