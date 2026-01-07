import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import MessagingClient from './MessagingClient';

interface MessagingPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MessagingPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'Messaging' });
  
  return {
    title: `${t('title')} | Clean Avenir`,
    description: t('startConversation'),
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function MessagingPage({ params }: MessagingPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return <MessagingClient locale={locale} />;
}
