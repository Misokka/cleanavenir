import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { LoanRequestForm } from '@/components/organisms/LoanRequestForm';
import { Typography } from '@/components/atoms/Typography';
import Link from 'next/link';

interface RequestPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RequestPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
  
  return {
    title: 'Demande de Prêt | Clean Avenir',
    description: 'Faites une demande de prêt personnalisée auprès de nos conseillers',
    robots: {
      index: false, 
      follow: false
    }
  };
}

export default async function RequestPage({ params }: RequestPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Demande de Prêt
            </Typography>
            <Typography variant="body" color="muted">
              Remplissez le formulaire pour soumettre votre demande à nos conseillers
            </Typography>
          </div>
          <Link 
            href={`/${locale}/client/dashboard/loans/simulate`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            📊 Simuler d'abord
          </Link>
        </div>

        <div className="max-w-2xl">
          <LoanRequestForm />
        </div>

        <div className="max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Typography variant="h4" className="mb-3 text-blue-900">
            📋 Processus de validation
          </Typography>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Votre demande est transmise à nos conseillers</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Un conseiller examine votre dossier (24-48h)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Vous recevez une réponse par email</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Si accepté, le prêt est activé automatiquement</span>
            </li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
