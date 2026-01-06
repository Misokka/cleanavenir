import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LearnMoreClient } from './LearnMoreClient';

interface LearnMorePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LearnMorePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  const t = await getTranslations({ locale, namespace: 'LearnMore' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function LearnMorePage({ params }: LearnMorePageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return <LearnMoreClient />;
}