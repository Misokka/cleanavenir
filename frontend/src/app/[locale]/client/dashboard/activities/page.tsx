import { getTranslations } from 'next-intl/server';
import ActivitiesClient from './ActivitiesClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Activities' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ActivitiesPage({ params }: PageProps) {
  const { locale } = await params;
  return <ActivitiesClient locale={locale} />;
}
