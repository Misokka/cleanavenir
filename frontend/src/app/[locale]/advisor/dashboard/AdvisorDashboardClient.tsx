'use client';

import React from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function AdvisorDashboardClient() {
  const locale = useLocale();

  // Mock data - À remplacer par de vraies données API
  const stats = {
    totalClients: 15,
    activeLoans: 8,
    pendingLoans: 3,
    totalLoanAmount: 250000,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Mes clients
            </Typography>
            <span className="text-2xl">👥</span>
          </div>
          <Typography variant="h2" className="font-bold text-blue-600">
            {stats.totalClients}
          </Typography>
          <Typography variant="caption" color="muted">
            Clients actifs
          </Typography>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Prêts actifs
            </Typography>
            <span className="text-2xl">✅</span>
          </div>
          <Typography variant="h2" className="font-bold text-green-600">
            {stats.activeLoans}
          </Typography>
          <Typography variant="caption" color="muted">
            Crédits en cours
          </Typography>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              En attente
            </Typography>
            <span className="text-2xl">⏳</span>
          </div>
          <Typography variant="h2" className="font-bold text-orange-600">
            {stats.pendingLoans}
          </Typography>
          <Typography variant="caption" color="muted">
            À valider
          </Typography>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Montant total
            </Typography>
            <span className="text-2xl">💰</span>
          </div>
          <Typography variant="h2" className="font-bold text-purple-600">
            {formatCurrency(stats.totalLoanAmount)}
          </Typography>
          <Typography variant="caption" color="muted">
            Prêts actifs
          </Typography>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Typography variant="h3" className="mb-4">
          🚀 Actions rapides
        </Typography>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/${locale}/advisor/clients`}>
            <Button variant="primary" className="w-full">
              👥 Voir mes clients
            </Button>
          </Link>
          <Link href={`/${locale}/advisor/loans`}>
            <Button variant="secondary" className="w-full">
              ✅ Prêts à valider ({stats.pendingLoans})
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Typography variant="h3" className="mb-4">
          📋 Activité récente
        </Typography>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <Typography variant="body" className="font-medium">
                Nouvelle demande de prêt
              </Typography>
              <Typography variant="caption" color="muted">
                Jean Dupont - 15,000€
              </Typography>
            </div>
            <Typography variant="caption" color="muted">
              Il y a 2h
            </Typography>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <Typography variant="body" className="font-medium">
                Nouveau client assigné
              </Typography>
              <Typography variant="caption" color="muted">
                Marie Martin
              </Typography>
            </div>
            <Typography variant="caption" color="muted">
              Il y a 5h
            </Typography>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <Typography variant="body" className="font-medium">
                Prêt validé
              </Typography>
              <Typography variant="caption" color="muted">
                Pierre Bernard - 25,000€
              </Typography>
            </div>
            <Typography variant="caption" color="muted">
              Hier
            </Typography>
          </div>
        </div>
      </Card>

      {/* Info Note */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <Typography variant="body" className="font-medium text-blue-900 mb-1">
              Note importante
            </Typography>
            <Typography variant="caption" className="text-blue-800">
              Ce dashboard affiche des données fictives. Les fonctionnalités d&apos;approbation 
              de prêts et de gestion de clients seront disponibles prochainement.
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}
