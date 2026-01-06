'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '../../../../../components/templates/DashboardLayout';
import { Card } from '../../../../../components/atoms/Card';
import { Typography } from '../../../../../components/atoms/Typography';
import { Button } from '../../../../../components/atoms/Button';
import { SavingDetailSkeleton } from '../../../../../components/molecules/SavingSkeleton';
import { TransferFromSavingModal } from '../../../../../components/molecules/TransferFromSavingModal';
import { useAuth } from '../../../../../contexts/AuthProvider';
import { useGetSavingDetails } from '../../../../../features/savings/useGetSavings';
import { useGetAccounts } from '../../../../../features/account/useGetAccounts';
import Link from 'next/link';

export default function SavingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const savingId = params.id as string;
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { saving, loading, error, refetch } = useGetSavingDetails(savingId);
  const { accounts } = useGetAccounts();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/auth/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <SavingDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <SavingDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !saving) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur
          </Typography>
          <Typography color="muted" className="mb-4">
            {error || 'Compte épargne introuvable'}
          </Typography>
          <Button variant="primary" onClick={() => router.push(`/${locale}/dashboard/savings`)}>
            Retour aux épargnes
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const sourceAccount = accounts?.find(acc => acc.id === saving.accountId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDailyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate * 1000000;
    return Math.ceil((saving.balance * (ratePercent / 100)) / 365 * 100) / 100;
  };

  const calculateMonthlyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate * 1000000;
    return Math.round((saving.balance * (ratePercent / 100)) / 12 * 100) / 100;
  };

  const calculateYearlyInterest = () => {
    if(!saving.savingProduct) return 0;
    const ratePercent = saving.savingProduct.rate * 1000000;
    return Math.round(saving.balance * (ratePercent / 100) * 100) / 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-full">
                <span className="text-4xl"></span>
              </div>
              <div>
                <Typography variant="caption" className="text-green-100 mb-1">
                  Compte Épargne
                </Typography>
                <Typography variant="h3" className="font-bold">
                  {formatCurrency(saving.balance)}
                </Typography>
              </div>
            </div>
            <Link href={`/${locale}/dashboard/savings`}>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                ← Retour
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Typography variant="caption" className="text-green-100 mb-1">
                {saving.savingProduct?.label}
              </Typography>
              <Typography variant="body" className="font-semibold">
                Taux: {(saving.savingProduct?.rate || 0) * 1000000}%
              </Typography>
            </div>
            <div>
              <Typography variant="caption" className="text-green-100 mb-1">
                Ouvert le
              </Typography>
              <Typography variant="body" className="font-semibold">
                {formatDate(saving.createdAt)}
              </Typography>
            </div>
            <div>
              <Typography variant="caption" className="text-green-100 mb-1">
                Dernière mise à jour
              </Typography>
              <Typography variant="body" className="font-semibold">
                {formatDate(saving.updatedAt)}
              </Typography>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                Intérêts journaliers
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateDailyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                par jour
              </Typography>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                Intérêts mensuels estimés
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateMonthlyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                par mois
              </Typography>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <Typography variant="caption" color="muted" className="mb-2">
                Intérêts annuels estimés
              </Typography>
              <Typography variant="h3" className="text-green-600 font-bold mb-1">
                +{formatCurrency(calculateYearlyInterest())}
              </Typography>
              <Typography variant="caption" color="muted">
                par an
              </Typography>
            </div>
          </Card>
        </div>

        {sourceAccount && (
          <Card>
            <Typography variant="h4" className="mb-4">
              Compte bancaire associé
            </Typography>
            <Link href={`/${locale}/dashboard/accounts/${sourceAccount.id}`}>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl"></span>
                  </div>
                  <div>
                    <Typography variant="body" className="font-medium">
                      {sourceAccount.label}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {sourceAccount.iban}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body" className="font-semibold">
                    {formatCurrency(sourceAccount.balance)}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    Solde disponible
                  </Typography>
                </div>
              </div>
            </Link>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl"></span>
              <div>
                <Typography variant="body" className="font-medium text-blue-900 mb-2">
                  Comment fonctionnent les intérêts ?
                </Typography>
                <Typography variant="caption" className="text-blue-800">
                  • Les intérêts sont calculés quotidiennement<br/>
                  • Formule : solde × (taux / 365)<br/>
                  • Ajoutés automatiquement chaque jour à 00:01<br/>
                  • Intérêts composés (calculés sur le nouveau solde)
                </Typography>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl"></span>
              <div>
                <Typography variant="body" className="font-medium text-green-900 mb-2">
                  Projection sur 1 an
                </Typography>
                <Typography variant="caption" className="text-green-800">
                  • Solde actuel : {formatCurrency(saving.balance)}<br/>
                  • Intérêts estimés : {formatCurrency(calculateYearlyInterest())}<br/>
                  • Solde final : {formatCurrency(saving.balance + calculateYearlyInterest())}<br/>
                  • Taux appliqué : {(saving.savingProduct?.rate || 0) * 1000000}%
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <Typography variant="h4" className="mb-4">
            Actions disponibles
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              onClick={() => setIsTransferModalOpen(true)}
              disabled={saving.balance === 0}
            >
              Transférer vers un compte
            </Button>
            <Button variant="outline" onClick={refetch}>
              Actualiser
            </Button>
            <Link href={`/${locale}/dashboard/savings`}>
              <Button variant="secondary">
                Voir toutes les épargnes
              </Button>
            </Link>
            {sourceAccount && (
              <Link href={`/${locale}/dashboard/accounts/${sourceAccount.id}`}>
                <Button variant="secondary">
                  Voir le compte source
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {accounts && (
          <TransferFromSavingModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            onSuccess={refetch}
            savingId={savingId}
            savingBalance={saving.balance}
            accounts={accounts}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
