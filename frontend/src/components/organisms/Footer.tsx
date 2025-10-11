"use client";
import { useTranslations } from "next-intl";
import { Typography } from '../atoms/Typography';

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-clean-dark text-white py-12">
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
              Votre banque du futur, simple, moderne et responsable.
            </Typography>
          </div>

          <div>
            <Typography variant="h4" color="white" className="mb-4">
              Navigation
            </Typography>
            <div className="space-y-2">
              <button className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('about')}
              </button>
              <button className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('contact')}
              </button>
              <button className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('legal')}
              </button>
              <button className="block text-white opacity-80 hover:opacity-100 transition-opacity text-left">
                {t('privacy')}
              </button>
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
