'use client';

import { useTranslations } from 'next-intl';
import { Typography } from '@/components/atoms/Typography';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="container mx-auto px-6 py-10">
      <Typography variant="h2" className="mb-4">{t('title')}</Typography>
      <Typography className="opacity-80 max-w-3xl mb-6">{t('intro')}</Typography>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Typography variant="h4" className="mb-2">{t('ourVisionTitle')}</Typography>
          <Typography className="opacity-80">{t('ourVisionText')}</Typography>
        </div>
        <div>
          <Typography variant="h4" className="mb-2">{t('ourValuesTitle')}</Typography>
          <Typography className="opacity-80">{t('ourValuesText')}</Typography>
        </div>
      </div>
    </div>
  );
}
