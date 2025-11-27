'use client';

import React from 'react';
import { useGetStatistics } from '@/features/admin/useGetStatistics';
import { StatisticsOverview } from '@/components/organisms/StatisticsOverview';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';

export default function StatisticsClient() {
  const { data: statistics, isLoading, error, refetch } = useGetStatistics();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Typography variant="h4" className="text-red-800 mb-2">
          ❌ Erreur
        </Typography>
        <Typography variant="body" color="muted" className="mb-4">
          {error.message || 'Impossible de charger les statistiques'}
        </Typography>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Typography variant="body" color="muted">
          Aucune statistique disponible
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => refetch()}>
          🔄 Actualiser
        </Button>
      </div>
      <StatisticsOverview statistics={statistics} />
    </div>
  );
}
