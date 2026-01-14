import { getTranslations } from 'next-intl/server';
import NotificationsAdvisorClient from './NotificationsAdvisorClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Notifications' });
  
  return {
    title: t('send.title'),
  };
}

export default async function NotificationsAdvisorPage({ params }: PageProps) {
  const { locale } = await params;
  return <NotificationsAdvisorClient locale={locale} />;
}
