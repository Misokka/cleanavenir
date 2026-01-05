'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { advisorService, AdvisorStatsDTO } from '@/infrastructure/web/services/advisorService';

export default function AdvisorDashboardClient() {
  const locale = useLocale();
  const [stats, setStats] = useState<AdvisorStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await advisorService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Typography variant="body">Chargement...</Typography>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <Typography variant="body" color="muted">
          Impossible de charger les statistiques
        </Typography>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Mes clients
            </Typography>
          </div>
          <Typography variant="h2" className="font-bold">
            {stats.totalClients}
          </Typography>
          <Typography variant="caption" color="muted">
            Clients actifs
          </Typography>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Prêts actifs
            </Typography>
          </div>
          <Typography variant="h2" className="font-bold">
            {stats.activeLoans}
          </Typography>
          <Typography variant="caption" color="muted">
            Crédits en cours
          </Typography>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              En attente
            </Typography>
          </div>
          <Typography variant="h2" className="font-bold">
            {stats.pendingLoans}
          </Typography>
          <Typography variant="caption" color="muted">
            À valider
          </Typography>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <Typography variant="caption" color="muted">
              Montant total
            </Typography>
          </div>
          <Typography variant="h3" className="font-bold break-words">
            {formatCurrency(stats.totalLoanAmount)}
          </Typography>
          <Typography variant="caption" color="muted">
            Prêts actifs
          </Typography>
        </Card>
      </div>

      <Card>
        <Typography variant="h3" className="mb-4">
          Actions rapides
        </Typography>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/${locale}/advisor/clients`}>
            <Button variant="primary" className="w-full">
              Voir mes clients
            </Button>
          </Link>
          <Link href={`/${locale}/advisor/loans`}>
            <Button variant="secondary" className="w-full">
              Prêts à valider ({stats.pendingLoans})
            </Button>
          </Link>
        </div>
      </Card>

      {/* <Card>
        <Typography variant="h3" className="mb-4">
          Activité récente
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
      </Card> */}
    </div>
  );
}
