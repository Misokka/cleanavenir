import { getTranslations } from 'next-intl/server';
import NotificationsClient from './NotificationsClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Notifications' });
  
  return {
    title: t('title'),
  };
}

export default async function NotificationsPage({ params }: PageProps) {
  const { locale } = await params;
  return <NotificationsClient locale={locale} />;
}
