import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import AdvisorMessagingClient from './AdvisorMessagingClient';

interface AdvisorMessagingPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdvisorMessagingPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Messaging' });
  
  return {
    title: `${t('advisor.inbox')} | Clean Avenir`,
    description: t('advisor.pendingDiscussions'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function AdvisorMessagingPage({ params }: AdvisorMessagingPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return <AdvisorMessagingClient locale={locale} />;
}
