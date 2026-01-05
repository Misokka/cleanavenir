'use client';

import { useTranslations } from 'next-intl';
import { Typography } from '@/components/atoms/Typography';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="container mx-auto px-6 py-10">
      <Typography variant="h2" className="mb-4">{t('title')}</Typography>
      <Typography className="opacity-80 max-w-3xl mb-6">{t('intro')}</Typography>
      <div className="space-y-2">
        <Typography>{t('email')}: contact@cleanavenir.fr</Typography>
        <Typography>{t('phone')}: +33 1 23 45 67 89</Typography>
      </div>
    </div>
  );
}
