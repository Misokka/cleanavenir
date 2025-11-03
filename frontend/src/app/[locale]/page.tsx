import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/organisms/Hero';
import { Features } from '@/components/organisms/Features';
import { AccountsOverview } from '@/components/organisms/AccountsOverview';
import { Stats } from '@/components/organisms/Stats';

interface HomePageProps {
  readonly params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('openGraph.title'),
      description: t('openGraph.description'),
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  return (
    <main className="min-h-screen">
      <Hero />
      
      <Features />
      
      <AccountsOverview />
      
      <Stats />
    </main>
  );
}