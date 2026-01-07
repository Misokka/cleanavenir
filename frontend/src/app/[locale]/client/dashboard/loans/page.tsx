'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { LoanCard } from '@/components/organisms/LoanCard';
import { useGetLoans } from '@/features/loans/useGetLoans';

export default function LoansPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const { loans, loading, error, refetch } = useGetLoans();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12 border-red-200 bg-red-50">
          <Typography variant="h4" className="mb-2 text-red-700">
            Erreur de chargement
          </Typography>
          <Typography color="muted" className="mb-4">
            {error}
          </Typography>
          <Button variant="primary" onClick={refetch}>
            Réessayer
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="body" color="muted">
              Gérez vos demandes de prêt et suivez vos remboursements
            </Typography>
          </div>
          <div className="flex space-x-3">
            <Link href={`/${locale}/client/dashboard/loans/simulate`}>
              <Button variant="outline" size="sm">
                Simuler
              </Button>
            </Link>
            <Link href={`/${locale}/client/dashboard/loans/request`}>
              <Button variant="primary" size="sm">
                + Nouvelle demande
              </Button>
            </Link>
          </div>
        </div>

        {loans && loans.length > 0 ? (
          <>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <Typography variant="caption" color="muted" className="mb-1">
                  Prêts actifs
                </Typography>
                <Typography variant="h3" className="text-gray-900 font-bold">
                  {loans.filter((l) => l.status === 'ACTIVE').length}
                </Typography>
              </Card>
              <Card className="border-l-4 border-l-amber-500">
                <Typography variant="caption" color="muted" className="mb-1">
                  En attente
                </Typography>
                <Typography variant="h3" className="text-gray-900 font-bold">
                  {loans.filter((l) => l.status === 'PENDING').length}
                </Typography>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <Typography variant="caption" color="muted" className="mb-1">
                  Remboursés
                </Typography>
                <Typography variant="h3" className="text-gray-900 font-bold">
                  {loans.filter((l) => l.status === 'PAID_OFF').length}
                </Typography>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <Typography variant="caption" color="muted" className="mb-1">
                  Refusés
                </Typography>
                <Typography variant="h3" className="text-gray-900 font-bold">
                  {loans.filter((l) => l.status === 'REJECTED').length}
                </Typography>
              </Card>
            </div>

            {loans.filter((l) => l.status === 'PENDING').length > 0 && (
              <div>
                <Typography variant="h3" className="mb-4">
                  Mes demandes en attente ({loans.filter((l) => l.status === 'PENDING').length})
                </Typography>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
                  {loans
                    .filter((loan) => loan.status === 'PENDING')
                    .map((loan) => (
                      <LoanCard key={loan.id} loan={loan} />
                    ))}
                </div>
              </div>
            )}

            <div>
              <Typography variant="h3" className="mb-4">
                Tous mes prêts ({loans.length})
              </Typography>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
                {loans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card className="text-center py-16">
            <Typography variant="h3" className="mb-4">
              Aucun prêt pour le moment
            </Typography>
            <Typography variant="body" color="muted" className="mb-8 max-w-md mx-auto">
              Vous n'avez pas encore de prêt actif. 
              Commencez par simuler un prêt pour découvrir nos offres.
            </Typography>
            <div className="flex justify-center space-x-4">
              <Link href={`/${locale}/client/dashboard/loans/simulate`}>
                <Button variant="outline">
                  Simuler un prêt
                </Button>
              </Link>
              <Link href={`/${locale}/client/dashboard/loans/request`}>
                <Button variant="primary">
                  + Faire une demande
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
