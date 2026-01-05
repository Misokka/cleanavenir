import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { Typography } from '@/components/atoms/Typography';
import AdvisorDashboardClient from './AdvisorDashboardClient';

export const metadata = {
  title: 'Dashboard Conseiller - Clean Avenir',
  description: 'Vue d\'ensemble pour les conseillers',
};

export default function AdvisorDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h1" className="mb-2">
            Dashboard Conseiller
          </Typography>
          <Typography variant="body" color="muted">
            Vue d&apos;ensemble de vos clients et prêts à valider
          </Typography>
        </div>

        <AdvisorDashboardClient />
      </div>
    </DashboardLayout>
  );
}
