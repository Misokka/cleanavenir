import React from 'react';
import { getTranslations } from 'next-intl/server';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import { SavingRateManager } from '@/components/organisms/SavingRateManager';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'admin' });

  return {
    title: 'Paramètres Admin',
    description: 'Gérer les paramètres de la plateforme',
  };
}

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h1" className="mb-2">
            ⚙️ Paramètres administrateur
          </Typography>
          <Typography variant="body" color="muted">
            Gérer les paramètres globaux de la plateforme
          </Typography>
        </div>

        <SavingRateManager />
      </div>
    </DashboardLayout>
  );
}
