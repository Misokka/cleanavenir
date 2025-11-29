import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { Typography } from '@/components/atoms/Typography';

export const metadata: Metadata = {
  title: 'Legal | Clean Avenir',
};

export default function LegalPage() {
  const t = useTranslations('Legal');

  return (
    <div className="container mx-auto px-6 py-10">
      <Typography variant="h2" className="mb-4">{t('title')}</Typography>
      <Typography className="opacity-80 max-w-3xl mb-6">{t('intro')}</Typography>
      <div className="space-y-4">
        <Typography className="opacity-80">{t('companyInfo')}</Typography>
        <Typography className="opacity-80">{t('legalNotice')}</Typography>
      </div>
    </div>
  );
}
