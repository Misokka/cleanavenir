"use client";
import { useTranslations } from 'next-intl';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';

export const Hero = () => {
  const t = useTranslations('Home.hero');

  return (
    <section className="bg-gradient-to-br from-clean-dark to-clean-secondary text-white py-20 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <Typography variant="h1" color="white" className="mb-6 max-w-4xl mx-auto">
          {t('title')}
        </Typography>
        
        <Typography variant="subtitle" color="white" className="mb-10 max-w-2xl mx-auto opacity-90">
          {t('subtitle')}
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="!bg-white !text-clean-dark hover:!bg-gray-100 font-semibold">
            {t('cta')}
          </Button>
          <Button size="lg" className="!bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-clean-dark">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  );
};