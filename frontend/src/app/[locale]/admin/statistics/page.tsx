import React from 'react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import StatisticsClient from './StatisticsClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'admin' });

  return {
    title: t('statistics.title'),
    description: t('statistics.description'),
  };
}

export default function StatisticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h1" className="mb-2">
              📊 Statistiques Générales
            </Typography>
            <Typography variant="body" color="muted">
              Vue d&apos;ensemble des données de la plateforme
            </Typography>
          </div>
        </div>

        <StatisticsClient />
      </div>
    </DashboardLayout>
  );
}
