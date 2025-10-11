import { Metadata } from 'next';
import { Hero } from '@/components/organisms/Hero';
import { Features } from '@/components/organisms/Features';
import { AccountsOverview } from '@/components/organisms/AccountsOverview';
import { Stats } from '@/components/organisms/Stats';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Découvrez Clean Avenir, votre banque du futur. Une expérience bancaire simple, moderne et responsable.',
  openGraph: {
    title: 'Clean Avenir - Votre banque du futur',
    description: 'Découvrez Clean Avenir, votre banque du futur. Une expérience bancaire simple, moderne et responsable.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      <Features />
      
      <AccountsOverview />
      
      <Stats />
    </main>
  );
}