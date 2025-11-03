import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

interface DashboardPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Dashboard.overview' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('description'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return <DashboardClient locale={locale} />;
}