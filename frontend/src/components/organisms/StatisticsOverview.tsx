'use client';

import React from 'react';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import type { StatisticsDTO } from '@/infrastructure/web/services/adminService';

interface StatisticsOverviewProps {
  statistics: StatisticsDTO;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ statistics }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value / 100);
  };

  const stats = [
    {
      title: 'Total Clients',
      value: statistics.totalClients,
      icon: '👥',
      color: 'blue',
      description: 'Clients enregistrés',
    },
    {
      title: 'Total Comptes',
      value: statistics.totalAccounts,
      icon: '🏦',
      color: 'green',
      description: 'Comptes bancaires actifs',
    },
    {
      title: 'Opérations',
      value: statistics.totalOperations,
      icon: '💳',
      color: 'purple',
      description: 'Transactions totales',
    },
    {
      title: 'Prêts Actifs',
      value: statistics.activeLoans,
      icon: '',
      color: 'orange',
      description: 'Crédits en cours',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-600';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-600';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={getColorClasses(stat.color)}>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="caption" color="muted">
                {stat.title}
              </Typography>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <Typography variant="h2" className="font-bold mb-1">
              {stat.value.toLocaleString('fr-FR')}
            </Typography>
            <Typography variant="caption" color="muted">
              {stat.description}
            </Typography>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="text-center py-6">
          <Typography variant="caption" className="text-white opacity-90 mb-2">
            Montant Total des Prêts Actifs
          </Typography>
          <Typography variant="h1" className="text-white font-bold">
            {formatCurrency(statistics.totalLoanAmount)}
          </Typography>
          <Typography variant="caption" className="text-white opacity-75 mt-2">
            Répartis sur {statistics.activeLoans} prêts
          </Typography>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <Typography variant="h4" className="mb-4">
            Ratios clés
          </Typography>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Typography variant="body" color="muted">
                Comptes par client
              </Typography>
              <Typography variant="body" className="font-semibold">
                {statistics.totalClients > 0
                  ? (statistics.totalAccounts / statistics.totalClients).toFixed(2)
                  : '0'}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography variant="body" color="muted">
                Taux de prêts actifs
              </Typography>
              <Typography variant="body" className="font-semibold">
                {statistics.totalClients > 0
                  ? ((statistics.activeLoans / statistics.totalClients) * 100).toFixed(1)
                  : '0'}
                %
              </Typography>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <Typography variant="h4" className="mb-4 text-yellow-900">
            Alertes
          </Typography>
          <div className="space-y-2">
            {statistics.activeLoans > 50 && (
              <div className="bg-yellow-100 rounded p-2">
                <Typography variant="caption" className="text-yellow-800">
                  Nombre élevé de prêts actifs
                </Typography>
              </div>
            )}
            {statistics.totalOperations === 0 && (
              <div className="bg-yellow-100 rounded p-2">
                <Typography variant="caption" className="text-yellow-800">
                  Aucune opération enregistrée
                </Typography>
              </div>
            )}
            {statistics.totalClients === 0 && (
              <div className="bg-red-100 rounded p-2">
                <Typography variant="caption" className="text-red-800">
                  Aucun client enregistré
                </Typography>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsOverview;
