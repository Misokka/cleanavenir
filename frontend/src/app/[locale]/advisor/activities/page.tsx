import { getTranslations } from 'next-intl/server';
import ActivitiesAdvisorClient from './ActivitiesAdvisorClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Activities' });
  
  return {
    title: t('create.title'),
  };
}

export default async function ActivitiesAdvisorPage({ params }: PageProps) {
  const { locale } = await params;
  return <ActivitiesAdvisorClient locale={locale} />;
}
