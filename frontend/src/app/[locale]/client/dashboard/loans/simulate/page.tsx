import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { LoanSimulator } from '@/components/organisms/LoanSimulator';
import { Typography } from '@/components/atoms/Typography';

interface SimulatePageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SimulatePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  return {
    title: 'Simulateur de Prêt | Clean Avenir',
    description: 'Simulez votre prêt et découvrez les mensualités adaptées à votre projet',
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function SimulatePage({ params }: SimulatePageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h2" className="mb-2">
            Simulateur de Prêt
          </Typography>
          <Typography variant="body" color="muted">
            Ajustez les paramètres pour estimer vos mensualités et le coût total de votre prêt
          </Typography>
        </div>

        <LoanSimulator />
      </div>
    </DashboardLayout>
  );
}
